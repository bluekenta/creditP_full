import { MongoClient } from 'mongodb';

let clientPromise = null;

function getClient () {
  if (!clientPromise) {
    const options = {};
    if (process.env.MONGO_USERNAME) {
      options.auth = {
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
      };
      options.authSource = 'admin';
      options.authMechanism = 'SCRAM-SHA-1';
    }
    clientPromise = new MongoClient(process.env.MONGO_URI, options).connect();
  }
  return clientPromise;
}

export async function getDb () {
  const client = await getClient();
  return client.db(process.env.MONGO_DB_NAME);
}
