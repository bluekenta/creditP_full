import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  Grid,
  GridColumn,
  Segment,
  Dropdown,
  Header,
  Table,
  TableRow,
  TableHeaderCell,
  TableHeader,
  Input,
  TableCell,
  TableBody,
  Icon,
} from 'semantic-ui-react';

const GET_FREQUENT_BUYERS = gql`
  query GetFrequentBuyers($category: String!, $minimumPurchaseCount: Int) {
    getFrequentBuyers(category: $category, minimumPurchaseCount: $minimumPurchaseCount) {
      customerId
      count
      totalAmount
    }
  }
`;

const CATEGORY_OPTIONS = [
  {
    key: 1,
    text: 'Food',
    value: 'food',
  },
  {
    key: 2,
    text: 'Travel',
    value: 'travel',
  },
  {
    key: 3,
    text: 'Home',
    value: 'home',
  },
  {
    key: 4,
    text: 'Entertainment',
    value: 'entertainment',
  },
  {
    key: 5,
    text: 'Clothing',
    value: 'clothing',
  },
  {
    key: 6,
    text: 'Health',
    value: 'health',
  },
  {
    key: 7,
    text: 'Other',
    value: 'other',
  },
];

const FrequentBuyers = () => {
  const [ minPurchases, setMinPurchases ] = useState(2);
  const [ selectedCategory, setSelectedCategory ] = useState(CATEGORY_OPTIONS[0].value);
  const [ sortedColumn, setSortedColumn ] = useState(null);
  const [ sortDirection, setSortDirection ] = useState(null);

  const category = selectedCategory || CATEGORY_OPTIONS[0].value;
  const minimumPurchaseCount = Math.max(1, parseInt(minPurchases, 10) || 1);

  const {
    data, loading, error,
  } = useQuery(GET_FREQUENT_BUYERS, {
    variables: {
      category,
      minimumPurchaseCount,
    },
  });
  const frequentBuyers = data?.getFrequentBuyers ?? [];

  if (error) {
    const detail = error.graphQLErrors?.[0]?.message || error.networkError?.result?.errors?.[0]?.message || error.message;
    return (
      <Segment>
        <Header as='h4' color='red'>Unable to load frequent buyers: {detail}</Header>
      </Segment>
    );
  }

  return (
    <>
      {loading && (
        <Segment loading>
          <div style={{ minHeight: 120 }} />
        </Segment>
      )}
      {!loading && (
      <>
      <Grid columns={3}>
        <GridColumn verticalAlign='middle'>
          <Header
            as='h3'
            content={`Frequent Buyers (${frequentBuyers.length})`}
            icon='shop'
          />
        </GridColumn>
        <GridColumn>
          Category:
          <Dropdown
            fluid
            search
            selection
            defaultValue={selectedCategory}
            options={CATEGORY_OPTIONS}
            placeholder='Select a Category'
            onChange={(e, { value }) => setSelectedCategory(value)}
          />
        </GridColumn>
        <GridColumn>
          Minimum Purchases:
          <br />
          <Input
            fluid
            defaultValue={minPurchases}
            min={1}
            type='number'
            onChange={(e) => setMinPurchases(e.target.value)}
          />
        </GridColumn>
      </Grid>
      {(!frequentBuyers.length) && (
        <Segment placeholder>
          <Header icon>
            <Icon name='warning circle' />
            There are no frequent buyers that match your criteria.
          </Header>
        </Segment>
      )}
      {(!!frequentBuyers.length) && (
        <Table
          celled
          sortable
        >
          <TableHeader>
            <TableRow>
              <TableHeaderCell
                sorted={sortedColumn === 'customerId' ? sortDirection : null}
                onClick={() => { setSortedColumn('customerId'); setSortDirection((sortedColumn === 'customerId' && sortDirection === 'ascending') ? 'descending' : 'ascending'); }}
              >
                Customer ID
              </TableHeaderCell>
              <TableHeaderCell
                sorted={sortedColumn === 'purchaseCount' ? sortDirection : null}
                onClick={() => { setSortedColumn('purchaseCount'); setSortDirection((sortedColumn === 'purchaseCount' && sortDirection === 'ascending') ? 'descending' : 'ascending'); }}
              >
                Purchase Count
              </TableHeaderCell>
              <TableHeaderCell
                sorted={sortedColumn === 'totalAmount' ? sortDirection : null}
                onClick={() => { setSortedColumn('totalAmount'); setSortDirection((sortedColumn === 'totalAmount' && sortDirection === 'ascending') ? 'descending' : 'ascending'); }}
              >
                Total Amount
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {frequentBuyers.map((row) => (
              <TableRow key={row.customerId}>
                <TableCell>{row.customerId}</TableCell>
                <TableCell>{row.count}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(row.totalAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
        </>
      )}
    </>
  );
};

export default FrequentBuyers;
