import assert from 'node:assert/strict';
import test from 'node:test';

import { findOrRestoreContactForSend } from '../utils/contact-upsert.js';

test('findOrRestoreContactForSend restores soft-deleted contacts instead of inserting duplicates', async () => {
  const calls = [];
  const restoredContact = { _id: 'contact-id', phone_number: '917990953931', deleted_at: null };
  const ContactModel = {
    findOneAndUpdate: async (...args) => {
      calls.push(args);
      return restoredContact;
    }
  };

  const contact = await findOrRestoreContactForSend(ContactModel, {
    phoneNumber: '917990953931',
    displayName: '917990953931',
    userId: '6a0ca2cacd2f9b40c318a51f',
    source: 'baileys'
  });

  assert.equal(contact, restoredContact);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0][0], {
    phone_number: '917990953931',
    user_id: '6a0ca2cacd2f9b40c318a51f'
  });
  assert.equal(calls[0][1].$set.deleted_at, null);
  assert.equal(calls[0][1].$set.updated_by, '6a0ca2cacd2f9b40c318a51f');
  assert.equal(calls[0][1].$setOnInsert.created_by, '6a0ca2cacd2f9b40c318a51f');
  assert.equal(calls[0][2].upsert, true);
  assert.equal(calls[0][2].new, true);
});
