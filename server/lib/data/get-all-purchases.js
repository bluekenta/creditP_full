import { getDb } from './db.js';

const getAllTransactions = async () => {
  const db = await getDb();
  const results = await db.collection('purchases').find({}).toArray();
  return results.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
};

export default getAllTransactions;
