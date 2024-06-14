import { contactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactsCollection.find();
  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    contactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(page, perPage, contactsCount);
  return {
    data: contacts,
    ...paginationData,
  };
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
