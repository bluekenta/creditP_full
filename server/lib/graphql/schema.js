import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Purchase {
    id: ID!
    customerId: ID!
    category: String!
    amount: Float!
  }

  type FrequentBuyer {
    customerId: ID!
    count: Int!
    totalAmount: Float!
  }

  type Query {
    getAllPurchases: [Purchase]
    getFrequentBuyers(category: String!, minimumPurchaseCount: Int): [FrequentBuyer]
    getSuspiciousPurchases: [Purchase]
  }
`;
