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

  type PageInfo {
    currentPage: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type FrequentBuyersConnection {
    frequentBuyers: [FrequentBuyer!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type SuspiciousPurchasesConnection {
    purchases: [Purchase!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type Query {
    getAllPurchases: [Purchase]
    getFrequentBuyers(category: String!, minimumPurchaseCount: Int, limit: Int, offset: Int): FrequentBuyersConnection
    getSuspiciousPurchases(limit: Int, offset: Int): SuspiciousPurchasesConnection
  }
`;
