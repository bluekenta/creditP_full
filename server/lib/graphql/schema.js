import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Purchase {
    id: ID!
    customerId: ID!
    category: String!
    amount: Float!
  }

  type Query {
    getAllPurchases: [Purchase]
  }
`;
