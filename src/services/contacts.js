import { contactsCollection } from '../db/models/contact.js';

export const getContacts = async () => {
  try {
    const contacts = await contactsCollection.find();
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

export const getContactByID = async (id) => {
  try {
    const contacts = await contactsCollection.findById(id);
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

export const createContact = async (payload) => {
  const contact = await contactsCollection.create(payload);
  return contact;
};

export const patchContact = async (contactId, options = {}) => {
  const rawResult = await contactsCollection.findOneAndUpdate(
    { _id: contactId },
    { new: true, ...options },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
  };
};

export const deleteContact = async (contactId) => {
  const contact = await contactsCollection.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};
