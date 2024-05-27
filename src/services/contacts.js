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
