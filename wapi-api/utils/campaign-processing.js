import Campaign from '../models/campaign.model.js';
import Template from '../models/template.model.js';
import WhatsappWaba from '../models/whatsapp-waba.model.js';
import Contact from '../models/contact.model.js';

const API_VERSION = 'v23.0';

import { getCampaignQueue } from '../queues/campaign-queue.js';
import { enqueueCampaignJobWithFallback } from './campaign-enqueue.js';
import { processCampaignMessageJob } from './campaign-job-processor.js';

const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;

const isNewVariablesFormat = (mapping) => {
  if (!mapping || typeof mapping !== 'object') return false;
  const keys = Object.keys(mapping);
  if (keys.length === 0) return true;
  const hasNonObjectIdKey = keys.some((k) => !OBJECT_ID_REGEX.test(k));
  return hasNonObjectIdKey;
};

const resolveVariablesForContact = (mapping, contact) => {
  if (!mapping || typeof mapping !== 'object') return {};
  const result = {};
  for (const [key, value] of Object.entries(mapping)) {
    if (value === undefined || value === null) continue;
    const strVal = String(value).trim();
    const match = strVal.match(/^\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}$/);
    if (match) {
      const fieldName = match[1];
      let resolved = '';
      if (contact) {
        if (fieldName in contact && contact[fieldName] != null) {
          resolved = String(contact[fieldName]);
        } else if (contact.custom_fields) {
          const cf = contact.custom_fields;
          const val = typeof cf.get === 'function' ? cf.get(fieldName) : cf[fieldName];
          if (val != null) resolved = String(val);
        }
      }
      result[key] = resolved;
    } else {
      result[key] = value;
    }
  }
  return result;
};

const getQueueSystem = async () => {
  const campaignQueue = getCampaignQueue();
  return { campaignQueue };
};

export const processCampaignInBackground = async (campaign) => {
  try {
    const waba = await WhatsappWaba.findById(campaign.waba_id);
    if (!waba) {
      throw new Error('WhatsApp WABA not found');
    }

    const templateName = campaign.template_name;
    const languageCode = campaign.language_code;

    const template = await Template.findById(campaign.template_id);
    if (!template) {
      throw new Error('Template not found');
    }

    const templateData = {
      template_name: templateName,
      language_code: languageCode,
      message: template.message_body,
      variables: {},
      media_url: campaign.media_url,
      coupon_code: campaign.coupon_code || null,
      carousel_products: campaign.carousel_products && Array.isArray(campaign.carousel_products) ? campaign.carousel_products : null,
      carousel_cards_data: campaign.carousel_cards_data && Array.isArray(campaign.carousel_cards_data) ? campaign.carousel_cards_data : null,
      offer_expiration_minutes: campaign.offer_expiration_minutes ?? null
    };

    const variablesMapping = campaign.variables_mapping || {};
    const mappingPlain = variablesMapping instanceof Map ? Object.fromEntries(variablesMapping) : variablesMapping;
    const useNewFormat = isNewVariablesFormat(mappingPlain);

    let contactMap = new Map();
    if (useNewFormat) {
      const contactIds = campaign.recipients.map((r) => r.contact_id).filter(Boolean);
      if (contactIds.length > 0) {
        const contacts = await Contact.find({ _id: { $in: contactIds } }).lean();
        contacts.forEach((c) => contactMap.set(c._id.toString(), c));
      }
    }

    const { campaignQueue } = await getQueueSystem();

    campaign.status = 'sending';
    campaign.sent_at = campaign.sent_at || new Date();
    campaign.stats.total_recipients = campaign.recipients.length;
    campaign.stats.pending_count = campaign.recipients.filter((r) => r.status === 'pending').length;
    campaign.stats.sent_count = campaign.recipients.filter((r) => r.status === 'sent').length;
    campaign.stats.failed_count = campaign.recipients.filter((r) => r.status === 'failed').length;
    await Campaign.findByIdAndUpdate(campaign._id, {
      $set: {
        status: 'sending',
        sent_at: campaign.sent_at,
        'stats.total_recipients': campaign.stats.total_recipients,
        'stats.pending_count': campaign.stats.pending_count,
        'stats.sent_count': campaign.stats.sent_count,
        'stats.failed_count': campaign.stats.failed_count
      }
    });

    const jobs = [];
    let inlineCount = 0;
    for (const recipient of campaign.recipients) {
      if (recipient.status !== 'pending') continue;

      const contactKey = recipient.contact_id?.toString?.();
      let variables = {};

      if (useNewFormat) {
        const contact = contactMap.get(contactKey);
        variables = resolveVariablesForContact(mappingPlain, contact);
      } else {
        const variablesMap = variablesMapping;
        variables =
          typeof variablesMap.get === 'function'
            ? (variablesMap.get(contactKey) || {})
            : (variablesMap[contactKey] || {});
      }

      console.log('Campaign variables mapping for contact', contactKey, ':', campaign.variables_mapping);
      console.log('Extracted variables for contact', recipient.contact_id?.toString?.(), ':', variables);

      const recipientTemplateData = {
        ...templateData,
        variables
      };

      const jobData = {
        campaignId: campaign._id.toString(),
        recipient: {
          contact_id: recipient.contact_id,
          phone_number: recipient.phone_number
        },
        userId: campaign.user_id,
        templateData: recipientTemplateData,
        wabaId: campaign.waba_id
      };

      const enqueueResult = await enqueueCampaignJobWithFallback({
        queue: campaignQueue,
        name: 'send_campaign_message',
        data: jobData,
        options: {
          attempts: 1,
          backoff: {
            type: 'fixed',
            delay: 1000
          },
          timeout: 30000,
          jobId: `${campaign._id}-${recipient.contact_id}`
        },
        processJob: processCampaignMessageJob,
        onFallback: async (error) => {
          console.error(`Campaign queue add failed for ${recipient.phone_number}; sending inline:`, error.message);
        }
      });

      if (enqueueResult.mode === 'queued') {
        jobs.push(enqueueResult.job);
      } else {
        inlineCount += 1;
      }
    }

    console.log(`Added ${jobs.length} jobs to campaign queue and processed ${inlineCount} inline for campaign ${campaign._id}`);

    console.log(`Campaign ${campaign._id} queued for sending. Total recipients: ${campaign.recipients.length}`);

  } catch (error) {
    console.error('Error processing campaign:', error);

    await Campaign.findByIdAndUpdate(campaign._id, {
      $set: {
        status: 'failed',
        updated_at: new Date()
      },
      $push: {
        error_log: {
          timestamp: new Date(),
          error: error.message
        }
      }
    });
  }
};
