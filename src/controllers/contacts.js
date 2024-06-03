import { getContacts, getContactByID } from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const contacts = await getContacts();
  res.json({
    status: `${res.statusCode}`,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactByID(contactId);
  if (contact) {
    res.json({
      status: `${res.statusCode}`,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } else {
    next(createHttpError(404, 'Student not found'));
    return;
    //   res.json({
    //     status: `${res.statusCode}`,
    //     message: `Not found contact with id ${contactId}!`,
    //   });
  }
  // } catch (err) {
  //   res.json({
  //     status: '500',
  //     message: 'Error retrieving contact',
  //     error: err.message,
  //   });
  // }
};
