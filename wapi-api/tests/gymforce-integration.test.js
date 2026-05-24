import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildGymforceOpenUrl,
  isGymforceEnabledForUser,
  resolveGymforceUrl,
  sanitizeGymforceLookupResponse
} from '../utils/gymforce-integration.js';

test('isGymforceEnabledForUser gates access by owner user id allowlist', () => {
  assert.equal(isGymforceEnabledForUser('user-1', 'user-1,user-2'), true);
  assert.equal(isGymforceEnabledForUser('user-3', 'user-1,user-2'), false);
  assert.equal(isGymforceEnabledForUser('user-1', ''), false);
});

test('buildGymforceOpenUrl creates an absolute deep link with source', () => {
  assert.equal(
    buildGymforceOpenUrl('https://admin.gymforce.com/', ' +91 79909-53931 '),
    'https://admin.gymforce.com/leads/open?phone=917990953931&source=synqzy'
  );
});

test('resolveGymforceUrl resolves relative Gymforce paths against admin base url', () => {
  assert.equal(
    resolveGymforceUrl('https://admin.gymforce.com/panel', '/leads/lead-1'),
    'https://admin.gymforce.com/leads/lead-1'
  );
});

test('sanitizeGymforceLookupResponse only exposes safe lookup fields', () => {
  const result = sanitizeGymforceLookupResponse({
    success: true,
    status: 'found',
    lead: {
      id: 'lead-1',
      name: 'Amit',
      phone: '917990953931',
      email: 'private@example.com',
      detail_url: '/leads/lead-1',
      open_url: '/leads/open?phone=917990953931'
    },
    token: 'should-not-leak'
  });

  assert.deepEqual(result, {
    success: true,
    status: 'found',
    lead: {
      id: 'lead-1',
      name: 'Amit',
      phone: '917990953931',
      detail_url: '/leads/lead-1',
      open_url: '/leads/open?phone=917990953931'
    }
  });
});
