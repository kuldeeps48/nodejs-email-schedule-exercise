import 'reflect-metadata';
import { config } from 'dotenv';
config();
import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'node:http';
import { errorHandler } from './lib/error-handler';
import { router } from './modules';
import { connectDB, disconnectDB } from './modules/database';
import { onboardingMailService } from './modules/email-registration';

let server: Server = null;

async function start() {
  await connectDB();
  await onboardingMailService.init();

  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(json());
  app.use('/v1', router);
  app.use(errorHandler);

  server = app.listen(Number.parseInt(process.env.PORT), () =>
    console.log(`Server listening on port:${process.env.PORT}`)
  );
}

async function stop() {
  console.log('Stopping server.');
  onboardingMailService.stop();
  server?.close((err) => {
    if (err) {
      console.error(err);
    }
  });

  await disconnectDB();
  console.log('Shutdown complete.');
}

start();

process.on('SIGINT', async () => {
  await stop();
});
