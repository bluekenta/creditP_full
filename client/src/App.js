import {
  Container,
  // Message,
  Menu,
  Tab,
  TabPane,
  Header,
} from 'semantic-ui-react';

import FrequentBuyers from './FrequentBuyers.js';
import SuspiciousPurchases from './SuspiciousPurchases.js';

function App () {
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
        <Tab panes={[
          {
            menuItem: 'Frequent Buyers',
            render: () => <TabPane><FrequentBuyers /></TabPane>,
          },
          {
            menuItem: 'Suspicious Purchases',
            render: () => <TabPane><SuspiciousPurchases /></TabPane>,
          },
        ]}
        />
      </Container>
    </>
  );
}

export default App;
