import { useQuery, gql } from '@apollo/client';
import {
  Container,
  Message,
  Menu,
  Tab,
  TabPane,
  Header,
} from 'semantic-ui-react';

import FrequentBuyers from './FrequentBuyers.js';
import SuspiciousPurchases from './SuspiciousPurchases.js';

export const GET_PURCHASES = gql`
  query PurchasesQuery {
    getAllPurchases {
      id
      customerId
      category
      amount
    }
  }
`;

function App () {
  const {
    loading, error, data,
  } = useQuery(GET_PURCHASES);

  return (
    <>
      <Menu stackable>
        <Menu.Item>
          <img
            alt='logo'
            src='https://platform.creditpulse.com/_next/image/?url=%2Fassets%2Fbranding%2FcreditPulse_title.png&w=256&q=75'
            style={{ width: 300 }}
          />
        </Menu.Item>
      </Menu>
      <Container style={{ marginTop: 20 }}>
        <Header
          as='h3'
          content='Credit Pulse Purchase Analyzer'
        />
        {(!!error) && (
          <Message error>
            <Message.Header>Unable to load data</Message.Header>
            {error.message}
          </Message>
        )}
        <Tab panes={[
          {
            menuItem: 'Frequent Buyers',
            render: () => <TabPane loading={loading}><FrequentBuyers purchases={data?.getAllPurchases || []} /></TabPane>,
          },
          {
            menuItem: 'Suspicious Purchases',
            render: () => <TabPane loading={loading}><SuspiciousPurchases purchases={data?.getAllPurchases || []} /></TabPane>,
          },
        ]}
        />
      </Container>
    </>
  );
}

export default App;
