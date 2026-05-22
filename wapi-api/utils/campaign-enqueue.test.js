import test from 'node:test';
import assert from 'node:assert/strict';

import { enqueueCampaignJobWithFallback } from './campaign-enqueue.js';

test('runs campaign job inline when queue add fails', async () => {
  const jobData = {
    campaignId: 'campaign-1',
    recipient: { phone_number: '911234567890' }
  };
  let processedData = null;

  const result = await enqueueCampaignJobWithFallback({
    queue: {
      add: async () => {
        throw new Error('Redis unavailable');
      }
    },
    name: 'send_campaign_message',
    data: jobData,
    options: { jobId: 'campaign-1-contact-1' },
    processJob: async (data) => {
      processedData = data;
      return { success: true, messageId: 'wamid.test' };
    }
  });

  assert.equal(result.mode, 'inline');
  assert.equal(result.result.messageId, 'wamid.test');
  assert.deepEqual(processedData, jobData);
});

test('uses queue when queue add succeeds', async () => {
  let processed = false;

  const result = await enqueueCampaignJobWithFallback({
    queue: {
      add: async (name, data, options) => ({ id: options.jobId, name, data })
    },
    name: 'send_campaign_message',
    data: { campaignId: 'campaign-2' },
    options: { jobId: 'campaign-2-contact-1' },
    processJob: async () => {
      processed = true;
    }
  });

  assert.equal(result.mode, 'queued');
  assert.equal(result.job.id, 'campaign-2-contact-1');
  assert.equal(processed, false);
});

test('runs campaign job inline when queue is marked as inline fallback', async () => {
  let processed = false;

  const result = await enqueueCampaignJobWithFallback({
    queue: {
      inlineFallback: true,
      add: async () => ({ id: 'fake-job' })
    },
    name: 'send_campaign_message',
    data: { campaignId: 'campaign-3' },
    options: { jobId: 'campaign-3-contact-1' },
    processJob: async () => {
      processed = true;
      return { success: true };
    }
  });

  assert.equal(result.mode, 'inline');
  assert.equal(processed, true);
});
