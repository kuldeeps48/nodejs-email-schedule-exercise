import 'reflect-metadata';
import { config } from 'dotenv';
config();
import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'node:http';

let server: Server = null;
async function start() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(json());

  server = app.listen(Number.parseInt(process.env.PORT), () =>
    console.log(`Server listening on port:${process.env.PORT}`)
  );
}

async function stop() {
  if (server) {
    server.close((err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}

start();
process.on('SIGINT', async () => {
  await stop();
});
