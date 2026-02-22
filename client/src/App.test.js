import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';

import App from './App';

const GET_FREQUENT_BUYERS = gql`
  query GetFrequentBuyers($category: String!, $minimumPurchaseCount: Int) {
    getFrequentBuyers(category: $category, minimumPurchaseCount: $minimumPurchaseCount) {
      customerId
      count
      totalAmount
    }
  }
`;
const GET_SUSPICIOUS_PURCHASES = gql`
  query GetSuspiciousPurchases {
    getSuspiciousPurchases {
      id
      customerId
      category
      amount
    }
  }
`;

const defaultMocks = [
  {
    request: { query: GET_FREQUENT_BUYERS, variables: { category: 'food', minimumPurchaseCount: 2 } },
    result: { data: { getFrequentBuyers: [] } },
  },
  {
    request: { query: GET_SUSPICIOUS_PURCHASES },
    result: { data: { getSuspiciousPurchases: [] } },
  },
];

test('renders the Credit Pulse Purchase Analyzer header', () => {
  render(
    <MockedProvider addTypename={false} mocks={defaultMocks}>
      <App />
    </MockedProvider>,
  );
  const headerElement = screen.getByText(/Credit Pulse Purchase Analyzer/i);
  expect(headerElement).toBeInTheDocument();
});
