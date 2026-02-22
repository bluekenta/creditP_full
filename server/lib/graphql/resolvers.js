import getAllPurchases from '../data/get-all-purchases.js';

export const resolvers = {
  Query: {
    getAllPurchases: async (root, args, context) => {
      let result;
      try {
        result = await getAllPurchases();
      } catch (error) {
        console.log(error);
        throw error;
      }
      return result;
    },
  },
};
