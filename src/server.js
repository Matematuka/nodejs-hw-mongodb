import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from '../src/utils/env.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';

const PORT = Number(env('PORT', '3000'));

const setuptServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  app.use(router);
  app.use('*', notFoundHandler);
  app.use(errorHandler);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setuptServer;
