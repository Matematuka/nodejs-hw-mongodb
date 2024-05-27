import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from '../src/utils/env.js';
import { getContacts, getContactByID } from './services/contacts.js';

const PORT = Number(env('PORT', '3000'));

const setuptServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getContacts();

    res.status(200).json({
      status: `${res.statusCode}`,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const contactId = req.params.id;
    const contacts = await getContactByID(contactId);

    res.status(200).json({
      status: `${res.statusCode}`,
      message: 'Successfully found contact with id ${contactId}!',
      data: contacts,
    });

    res.status(404).json({
      status: `${res.statusCode}`,
      message: 'Not found contact with id ${contactId}!',
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setuptServer;
