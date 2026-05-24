import { Contact } from '../models/index.js';
import {
  buildGymforceOpenUrl,
  isGymforceEnabledForUser,
  resolveGymforceUrl,
  sanitizeGymforceLookupResponse
} from '../utils/gymforce-integration.js';

const LOOKUP_TIMEOUT_MS = 8000;

const getOwnerUserId = (req) => {
  return (req.user?.owner_id || req.user?.id || '').toString();
};

const callGymforceLookup = async (phoneNumber) => {
  const lookupApiUrl = process.env.GYMFORCE_LOOKUP_API_URL;
  if (!lookupApiUrl) {
    throw new Error('GYMFORCE_LOOKUP_API_URL is not configured');
  }

  const url = new URL(lookupApiUrl);
  url.searchParams.set('phone', phoneNumber);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(process.env.GYMFORCE_LOOKUP_API_KEY
          ? { Authorization: `Bearer ${process.env.GYMFORCE_LOOKUP_API_KEY}` }
          : {})
      },
      signal: controller.signal
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || payload.error || `Gymforce lookup failed with ${response.status}`);
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
};

export const lookupContact = async (req, res) => {
  try {
    const ownerUserId = getOwnerUserId(req);

    if (!isGymforceEnabledForUser(ownerUserId)) {
      return res.json({
        success: true,
        enabled: false
      });
    }

    const { contact_id: contactId } = req.query;
    if (!contactId) {
      return res.status(400).json({
        success: false,
        enabled: true,
        message: 'contact_id is required'
      });
    }

    const contact = await Contact.findOne({
      _id: contactId,
      user_id: ownerUserId,
      deleted_at: null
    }).select('phone_number name').lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        enabled: true,
        message: 'Contact not found'
      });
    }

    const openUrl = buildGymforceOpenUrl(process.env.GYMFORCE_ADMIN_BASE_URL, contact.phone_number);

    try {
      const lookupPayload = await callGymforceLookup(contact.phone_number);
      const sanitized = sanitizeGymforceLookupResponse(lookupPayload);
      const gymforceOpenUrl = resolveGymforceUrl(process.env.GYMFORCE_ADMIN_BASE_URL, sanitized.open_url);

      return res.json({
        ...sanitized,
        success: true,
        enabled: true,
        contact: {
          id: contact._id.toString(),
          phone_number: contact.phone_number,
          name: contact.name
        },
        open_url: gymforceOpenUrl || openUrl
      });
    } catch (error) {
      return res.json({
        success: true,
        enabled: true,
        status: 'unavailable',
        contact: {
          id: contact._id.toString(),
          phone_number: contact.phone_number,
          name: contact.name
        },
        open_url: openUrl,
        message: error.message
      });
    }
  } catch (error) {
    console.error('Gymforce contact lookup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to lookup Gymforce contact'
    });
  }
};

export default {
  lookupContact
};
