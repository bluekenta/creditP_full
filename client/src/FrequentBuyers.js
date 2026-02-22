import { useState, useEffect } from 'react';
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
  Button,
  Menu,
} from 'semantic-ui-react';

const PAGE_SIZE = 20;

const GET_FREQUENT_BUYERS = gql`
  query GetFrequentBuyers($category: String!, $minimumPurchaseCount: Int, $limit: Int, $offset: Int) {
    getFrequentBuyers(category: $category, minimumPurchaseCount: $minimumPurchaseCount, limit: $limit, offset: $offset) {
      frequentBuyers {
        customerId
        count
        totalAmount
      }
      totalCount
      pageInfo {
        currentPage
        totalPages
        hasNextPage
        hasPreviousPage
      }
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
  const [ page, setPage ] = useState(1);

  const category = selectedCategory || CATEGORY_OPTIONS[0].value;
  const minimumPurchaseCount = Math.max(1, parseInt(minPurchases, 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const {
    data, loading, error,
  } = useQuery(GET_FREQUENT_BUYERS, {
    variables: {
      category,
      minimumPurchaseCount,
      limit: PAGE_SIZE,
      offset,
    },
  });

  const connection = data?.getFrequentBuyers;
  const frequentBuyers = connection?.frequentBuyers ?? [];
  const totalCount = connection?.totalCount ?? 0;
  const pageInfo = connection?.pageInfo ?? {
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const goToPage = (nextPage) => setPage((p) => Math.max(1, Math.min(nextPage, pageInfo.totalPages)));

  useEffect(() => { setPage(1); }, [ category, minimumPurchaseCount ]);

  if (error) {
    const detail = error.graphQLErrors?.[0]?.message || error.networkError?.result?.errors?.[0]?.message || error.message;
    return (
      <Segment>
        <Header
          as='h4'
          color='red'
        >
          Unable to load frequent buyers:
          {detail}
        </Header>
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
                content={`Frequent Buyers (${totalCount} total)`}
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
          {(!!frequentBuyers.length && pageInfo.totalPages > 1) && (
            <Menu
              secondary
              style={{ marginTop: 12 }}
            >
              <Menu.Item>
                <Button
                  disabled={!pageInfo.hasPreviousPage}
                  icon='chevron left'
                  onClick={() => goToPage(page - 1)}
                />
              </Menu.Item>
              <Menu.Item style={{ pointerEvents: 'none' }}>
                Page
                {' '}
                {pageInfo.currentPage}
                {' '}
                of
                {' '}
                {pageInfo.totalPages}
              </Menu.Item>
              <Menu.Item>
                <Button
                  disabled={!pageInfo.hasNextPage}
                  icon='chevron right'
                  onClick={() => goToPage(page + 1)}
                />
              </Menu.Item>
            </Menu>
          )}
        </>
      )}
    </>
  );
};

export default FrequentBuyers;
