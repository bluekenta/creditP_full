import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';

import App from './App';

const GET_FREQUENT_BUYERS = gql`
  query GetFrequentBuyers($category: String!, $minimumPurchaseCount: Int, $limit: Int, $offset: Int) {
    getFrequentBuyers(category: $category, minimumPurchaseCount: $minimumPurchaseCount, limit: $limit, offset: $offset) {
      frequentBuyers { customerId count totalAmount }
      totalCount
      pageInfo { currentPage totalPages hasNextPage hasPreviousPage }
    }
  }
`;
const GET_SUSPICIOUS_PURCHASES = gql`
  query GetSuspiciousPurchases($limit: Int, $offset: Int) {
    getSuspiciousPurchases(limit: $limit, offset: $offset) {
      purchases { id customerId category amount }
      totalCount
      pageInfo { currentPage totalPages hasNextPage hasPreviousPage }
    }
  }
`;

const pageInfo = {
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};
const defaultMocks = [
  {
    request: {
      query: GET_FREQUENT_BUYERS,
      variables: {
        category: 'food',
        minimumPurchaseCount: 2,
        limit: 20,
        offset: 0,
      },
    },
    result: {
      data: {
        getFrequentBuyers: {
          frequentBuyers: [],
          totalCount: 0,
          pageInfo,
        },
      },
    },
  },
  {
    request: {
      query: GET_SUSPICIOUS_PURCHASES,
      variables: {
        limit: 20,
        offset: 0,
      },
    },
    result: {
      data: {
        getSuspiciousPurchases: {
          purchases: [],
          totalCount: 0,
          pageInfo,
        },
      },
    },
  },
];

test('renders the Credit Pulse Purchase Analyzer header', () => {
  render(
    <MockedProvider
      addTypename={false}
      mocks={defaultMocks}
    >
      <App />
    </MockedProvider>,
  );
  const headerElement = screen.getByText(/Credit Pulse Purchase Analyzer/i);
  expect(headerElement).toBeInTheDocument();
});
