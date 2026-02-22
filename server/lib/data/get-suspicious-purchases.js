import { getDb } from './db.js';

const SUSPICIOUS_AMOUNT_THRESHOLD = 500;

/**
 * Get purchases over the suspicious amount threshold.
 * Uses MongoDB query - only matching documents are transferred.
 */
const getSuspiciousPurchases = async () => {
  const db = await getDb();
  const results = await db
    .collection('purchases')
    .find({ amount: { $gt: SUSPICIOUS_AMOUNT_THRESHOLD } })
    .toArray();

  return results.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
};

export default getSuspiciousPurchases;
