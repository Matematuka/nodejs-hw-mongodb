import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from '../src/utils/env.js';

const PORT = Number(env('PORT', '3000'));

export const setuptServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
