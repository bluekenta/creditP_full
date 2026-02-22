import getAllPurchases from '../data/get-all-purchases.js';
import getFrequentBuyers from '../data/get-frequent-buyers.js';
import getSuspiciousPurchases from '../data/get-suspicious-purchases.js';

export const resolvers = {
  Query: {
    getAllPurchases: async () => {
      try {
        return await getAllPurchases();
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    getFrequentBuyers: async (root, { category, minimumPurchaseCount, limit, offset }) => {
      try {
        return await getFrequentBuyers(category, minimumPurchaseCount ?? 1, limit ?? 20, offset ?? 0);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    getSuspiciousPurchases: async (root, { limit, offset }) => {
      try {
        return await getSuspiciousPurchases(limit ?? 20, offset ?? 0);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
