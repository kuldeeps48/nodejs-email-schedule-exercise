import { getConnectionOptions, createConnection, Connection } from 'typeorm';
import { models } from '../index';

let connection: Connection = null;

export async function connectDB(): Promise<void> {
  const options = await getConnectionOptions();
  if (!connection?.isConnected) {
    connection = await createConnection({ ...options, entities: models });
    await connection.query('SELECT 1;');
    console.log('DB connected');
  }
}

export async function disconnectDB(): Promise<void> {
  if (connection?.isConnected) {
    await connection.close();
  }
}
