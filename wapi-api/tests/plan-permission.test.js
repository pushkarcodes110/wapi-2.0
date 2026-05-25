import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveSubscriptionFeatureLimit } from '../middlewares/plan-permission.js';

test('resolveSubscriptionFeatureLimit prefers subscription override over plan limit', () => {
  const limit = resolveSubscriptionFeatureLimit(
    { features: { contacts: 50 } },
    { features: { contacts: 1 } },
    'contacts'
  );

  assert.equal(limit, 50);
});

test('resolveSubscriptionFeatureLimit keeps zero override as unlimited', () => {
  const limit = resolveSubscriptionFeatureLimit(
    { features: { contacts: 0 } },
    { features: { contacts: 1 } },
    'contacts'
  );

  assert.equal(limit, 0);
});

test('resolveSubscriptionFeatureLimit keeps false boolean override', () => {
  const limit = resolveSubscriptionFeatureLimit(
    { features: { analytics: false } },
    { features: { analytics: true } },
    'analytics'
  );

  assert.equal(limit, false);
});

test('resolveSubscriptionFeatureLimit falls back to plan feature when override is absent', () => {
  const limit = resolveSubscriptionFeatureLimit(
    { features: { contacts: 10 } },
    { features: { tags: 3 } },
    'tags'
  );

  assert.equal(limit, 3);
});
