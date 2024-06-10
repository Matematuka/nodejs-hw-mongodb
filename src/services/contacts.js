import { contactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  try {
    const contactsQuery = contactsCollection.find();
    const contactsCount = await contactsCollection
      .find()
      .merge(contactsQuery)
      .countDocuments();
    const contacts = await contactsQuery.skip(skip).limit(limit).exec();

    const paginationData = calculatePaginationData(
      contactsCount,
      perPage,
      page,
    );
    return {
      data: contacts,
      ...paginationData,
    };
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

export const patchContact = async (contactId, payload, options = {}) => {
  const rawResult = await contactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) => {
  const contact = await contactsCollection.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};
