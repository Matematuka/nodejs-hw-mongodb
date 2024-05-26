import { initMongoDB } from './db/initMongoDB.js';
import { setuptServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB();
  setuptServer();
};

bootstrap();
