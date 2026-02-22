import { getDb } from './db.js';

const SUSPICIOUS_AMOUNT_THRESHOLD = 500;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Get a page of suspicious purchases (amount > threshold).
 * Offset-based pagination for page numbers.
 */
const getSuspiciousPurchases = async (limit = DEFAULT_LIMIT, offset = 0) => {
  const db = await getDb();
  const coll = db.collection('purchases');
  const filter = { amount: { $gt: SUSPICIOUS_AMOUNT_THRESHOLD } };

  const cap = Math.min(Math.max(1, limit), MAX_LIMIT);
  const skip = Math.max(0, offset);

  const [totalCount, results] = await Promise.all([
    coll.countDocuments(filter),
    coll
      .find(filter)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(cap)
      .toArray(),
  ]);

  const purchases = results.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
  const totalPages = Math.max(1, Math.ceil(totalCount / cap));
  const currentPage = Math.min(Math.max(1, Math.floor(skip / cap) + 1), totalPages);

  return {
    purchases,
    totalCount,
    pageInfo: {
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};

export default getSuspiciousPurchases;
