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
import saveFileToUploadDir from '../utils/saveFileToUploadDir.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

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
  const newContact = req.body;
  newContact.userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const createdContact = await createContact({
    ...newContact,
    photo: photoUrl,
  });

  res.status(201).json({
    status: '201',
    message: 'Successfully created contact!',
    data: createdContact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const photo = req.file;
  const userId = req.user._id;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const patch = req.body;

  const result = await patchContact(contactId, userId, {
    ...patch,
    photo: photoUrl,
  });

  if (!result || !contactId) {
    return res.status(404).json({
      status: '404',
      message: 'Contact not found',
      data: null,
    });
  }

  res.status(200).json({
    status: '200',
    message: 'Successfully patched a contact!',
    data: result,
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
