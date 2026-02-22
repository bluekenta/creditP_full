import { MongoClient } from 'mongodb';

const getAllTransactions = async () => {
  const options = {};
  if (process.env.MONGO_USERNAME) {
    options.auth = {
      username: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
    };
    options.authSource = 'admin';
    options.authMechanism = 'SCRAM-SHA-1';
  }
  const mongoClient = new MongoClient(process.env.MONGO_URI, options);

  const results = await mongoClient
    .db(process.env.MONGO_DB_NAME)
    .collection('purchases')
    .find({})
    .toArray();

  return results.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
};

export default getAllTransactions;
