import {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  patchContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { type, isFavourite } = parseFilterParams(req.query);
  const userId = req.user._id;

  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
    userId,
  });
  res.json({
    status: `${res.statusCode}`,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const contactId = req.params.contactId;

  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    return next(createHttpError(404, `Contact not found`));
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact({ userId: req.user._id, ...req.body });

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const contactId = req.params.contactId;

  const contact = await patchContact(contactId, req.user._id, req.body);

  if (!contact) {
    return next(createHttpError(404, `Contact not found`));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const contactId = req.params.contactId;

  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    return next(createHttpError(404, `Contact not found`));
  }

  res.status(204).send();
};
