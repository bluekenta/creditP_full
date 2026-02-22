import { getDb } from './db.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const STANDARD_DEVIATIONS = 2;

/**
 * Suspicious = out of the ordinary for that customer's history.
 * A purchase is flagged if amount > mean + (STANDARD_DEVIATIONS * std) for that customer.
 * Only customers with at least 2 purchases get a baseline; single-purchase customers are skipped.
 */
const getSuspiciousPurchases = async (limit = DEFAULT_LIMIT, offset = 0) => {
  const db = await getDb();
  const coll = db.collection('purchases');
  const cap = Math.min(Math.max(1, limit), MAX_LIMIT);
  const skip = Math.max(0, offset);

  const matchOutlier = {
    $match: {
      $expr: {
        $and: [
          { $ne: ['$stats.std', null] },
          { $gte: ['$stats.n', 2] },
          {
            $gt: [
              '$amount',
              {
                $add: [
                  '$stats.mean',
                  { $multiply: ['$stats.std', STANDARD_DEVIATIONS] },
                ],
              },
            ],
          },
        ],
      },
    },
  };

  const basePipeline = [
    {
      $lookup: {
        from: 'purchases',
        let: { cid: '$customerId' },
        pipeline: [
          { $match: { $expr: { $eq: ['$customerId', '$$cid'] } } },
          {
            $group: {
              _id: null,
              mean: { $avg: '$amount' },
              std: { $stdDevSamp: '$amount' },
              n: { $sum: 1 },
            },
          },
        ],
        as: 'stats',
      },
    },
    { $unwind: '$stats' },
    matchOutlier,
    { $project: { stats: 0 } },
    { $sort: { _id: 1 } },
  ];

  const [countResult, results] = await Promise.all([
    coll.aggregate([...basePipeline, { $count: 'total' }]).toArray(),
    coll
      .aggregate([...basePipeline, { $skip: skip }, { $limit: cap }])
      .toArray(),
  ]);

  const totalCount = countResult[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / cap));
  const currentPage = Math.min(Math.max(1, Math.floor(skip / cap) + 1), totalPages);

  const purchases = results.map(({ _id, ...rest }) => ({
    id: _id.toString(),
    ...rest,
  }));

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
