import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contact', ctrlWrapper(createContactController));
router.patch('/contact/:contactId'), ctrlWrapper(patchContactController);
router.delete('/contact/:contactId', ctrlWrapper(deleteContactController));

export default router;
