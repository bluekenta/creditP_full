import { getDb } from './db.js';

/**
 * Get frequent buyers for a category with at least minimumPurchaseCount purchases.
 * Uses MongoDB aggregation - O(n) single pass, minimal data transfer.
 */
const getFrequentBuyers = async (category, minimumPurchaseCount = 1) => {
  const db = await getDb();
  const results = await db
    .collection('purchases')
    .aggregate([
      { $match: { category } },
      {
        $group: {
          _id: '$customerId',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $match: { count: { $gte: minimumPurchaseCount } } },
      {
        $project: {
          _id: 0,
          customerId: '$_id',
          count: 1,
          totalAmount: 1,
        },
      },
    ])
    .toArray();

  return results.map((r) => ({
    customerId: String(r.customerId),
    count: r.count,
    totalAmount: r.totalAmount,
  }));
};

export default getFrequentBuyers;
