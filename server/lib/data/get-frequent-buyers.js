import { getDb } from './db.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Get a page of frequent buyers for a category (offset-based pagination).
 */
const getFrequentBuyers = async (category, minimumPurchaseCount = 1, limit = DEFAULT_LIMIT, offset = 0) => {
  const db = await getDb();
  const cap = Math.min(Math.max(1, limit), MAX_LIMIT);
  const skip = Math.max(0, offset);

  const pipeline = [
    { $match: { category } },
    {
      $group: {
        _id: '$customerId',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    { $match: { count: { $gte: minimumPurchaseCount } } },
    { $sort: { totalAmount: -1 } },
  ];

  const [countResult, results] = await Promise.all([
    db.collection('purchases').aggregate([...pipeline, { $count: 'total' }]).toArray(),
    db
      .collection('purchases')
      .aggregate([
        ...pipeline,
        { $skip: skip },
        { $limit: cap },
        {
          $project: {
            _id: 0,
            customerId: '$_id',
            count: 1,
            totalAmount: 1,
          },
        },
      ])
      .toArray(),
  ]);

  const totalCount = countResult[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / cap));
  const currentPage = Math.min(Math.max(1, Math.floor(skip / cap) + 1), totalPages);

  const frequentBuyers = results.map((r) => ({
    customerId: String(r.customerId),
    count: r.count,
    totalAmount: r.totalAmount,
  }));

  return {
    frequentBuyers,
    totalCount,
    pageInfo: {
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};

export default getFrequentBuyers;
