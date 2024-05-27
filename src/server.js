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
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

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
    try {
      const { contactId } = req.params;
      const contact = await getContactByID(contactId);
      if (contact) {
        res.status(200).json({
          status: `${res.statusCode}`,
          message: `Successfully found contact with id ${contactId}!`,
          data: contact,
        });
      } else {
        res.status(404).json({
          status: `${res.statusCode}`,
          message: `Not found contact with id ${contactId}!`,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: '500',
        message: 'Error retrieving contact',
        error: err.message,
      });
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res) => {
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
