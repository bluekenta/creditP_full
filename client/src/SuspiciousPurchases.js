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
} from 'semantic-ui-react';

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

const SuspiciousPurchases = () => {
  const [ sortedColumn, setSortedColumn ] = useState(null);
  const [ sortDirection, setSortDirection ] = useState(null);

  const {
    data, loading, error,
  } = useQuery(GET_SUSPICIOUS_PURCHASES);
  const suspiciousPurchases = data?.getSuspiciousPurchases ?? [];

  if (error) {
    return (
      <Segment>
        <Header as='h4' color='red'>Unable to load suspicious purchases: {error.message}</Header>
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
        content={`Suspicious Purchases (${suspiciousPurchases.length})`}
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
            There are no suspicious purchases found.
          </Header>
        </Segment>
      )}
      {(!!suspiciousPurchases.length) && (
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
      )}
      </>
      )}
    </>
  );
};

export default SuspiciousPurchases;
