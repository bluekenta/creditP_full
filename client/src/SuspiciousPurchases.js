import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  Segment,
  Header,
  Table,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Icon,
  Button,
  Menu,
} from 'semantic-ui-react';

const PAGE_SIZE = 20;

const GET_SUSPICIOUS_PURCHASES = gql`
  query GetSuspiciousPurchases($limit: Int, $offset: Int) {
    getSuspiciousPurchases(limit: $limit, offset: $offset) {
      purchases {
        id
        customerId
        category
        amount
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

const SuspiciousPurchases = () => {
  const [ sortedColumn, setSortedColumn ] = useState(null);
  const [ sortDirection, setSortDirection ] = useState(null);
  const [ page, setPage ] = useState(1);

  const offset = (page - 1) * PAGE_SIZE;

  const {
    data,
    loading,
    error,
  } = useQuery(GET_SUSPICIOUS_PURCHASES, {
    variables: {
      limit: PAGE_SIZE,
      offset,
    },
  });

  const connection = data?.getSuspiciousPurchases;
  const suspiciousPurchases = connection?.purchases ?? [];
  const totalCount = connection?.totalCount ?? 0;
  const pageInfo = connection?.pageInfo ?? {
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const goToPage = (nextPage) => setPage((p) => Math.max(1, Math.min(nextPage, pageInfo.totalPages)));

  if (error) {
    return (
      <Segment>
        <Header
          as='h4'
          color='red'
        >
          Unable to load suspicious purchases:
          {' '}
          {error.message}
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
          <Header
            as='h3'
            content={`Suspicious Purchases (${totalCount} total)`}
            icon='spy'
            style={{
              marginTop: 15,
              marginBottom: 25,
            }}
          />
          {(!suspiciousPurchases.length) && (
            <Segment placeholder>
              <Header icon>
                <Icon
                  color='green'
                  name='check circle'
                />
              </Header>
              There are no suspicious purchases found.
            </Segment>
          )}
          {(!!suspiciousPurchases.length) && (
            <>
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
                      sorted={sortedColumn === 'category' ? sortDirection : null}
                      onClick={() => { setSortedColumn('category'); setSortDirection((sortedColumn === 'category' && sortDirection === 'ascending') ? 'descending' : 'ascending'); }}
                    >
                      Category
                    </TableHeaderCell>
                    <TableHeaderCell
                      sorted={sortedColumn === 'amount' ? sortDirection : null}
                      onClick={() => { setSortedColumn('amount'); setSortDirection((sortedColumn === 'amount' && sortDirection === 'ascending') ? 'descending' : 'ascending'); }}
                    >
                      Amount
                    </TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suspiciousPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.customerId}</TableCell>
                      <TableCell>{purchase.category}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(purchase.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(pageInfo.totalPages > 1) && (
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
      )}
    </>
  );
};

export default SuspiciousPurchases;
