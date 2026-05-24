export const findOrRestoreContactForSend = async (ContactModel, {
  phoneNumber,
  displayName,
  userId,
  source = 'whatsapp'
}) => {
  return ContactModel.findOneAndUpdate(
    {
      phone_number: phoneNumber,
      user_id: userId
    },
    {
      $set: {
        deleted_at: null,
        updated_by: userId
      },
      $setOnInsert: {
        phone_number: phoneNumber,
        name: displayName || phoneNumber,
        source,
        user_id: userId,
        created_by: userId,
        status: 'lead'
      }
    },
    {
      new: true,
      setDefaultsOnInsert: true,
      upsert: true
    }
  );
};
