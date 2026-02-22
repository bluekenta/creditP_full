import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import App, { GET_PURCHASES } from './App';

test('renders the Credit Pulse Purchase Analyzer header', () => {
  render(
    <MockedProvider
      addTypename={false}
      mocks={[
        {
          request: { query: GET_PURCHASES },
          result: {
            data: {
              getAllPurchases: [],
            },
          },
        },
      ]}
    >
      <App />
    </MockedProvider>,
  );
  const headerElement = screen.getByText(/Credit Pulse Purchase Analyzer/i);
  expect(headerElement).toBeInTheDocument();
});
