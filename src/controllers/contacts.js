import {
  getContacts,
  getContactByID,
  createContact,
  deleteContact,
  patchContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import saveFile from '../utils/saveFile.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });
  res.json({
    status: `${res.statusCode}`,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

const setAuthContactId = (req) => {
  let authContactId = {};
  const { contactId } = req.params;
  const userId = req.user._id;
  if (contactId) {
    authContactId = { _id: contactId };
  }
  if (userId) {
    authContactId = { ...authContactId, userId: userId };
  }

  return authContactId;
};

export const getContactByIdController = async (req, res, next) => {
  const authContactId = setAuthContactId(req);
  const contact = await getContactByID(authContactId);
  if (contact) {
    res.json({
      status: `${res.statusCode}`,
      message: `Successfully found contact with id ${authContactId._id}!`,
      data: contact,
    });
  } else {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
};

export const createContactController = async (req, res) => {
  const photo = req.file;
  let photoUrl;

  if (photo) {
    photoUrl = await saveFile(photo);
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
    ...req.body,
  });

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    photoUrl = await saveFile(photo);
  }

  const result = await patchContact(
    contactId,
    { userId: req.user._id },
    { photo: photoUrl, ...req.body },
  );

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const authContactId = setAuthContactId(req);
  const contact = await deleteContact(authContactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
