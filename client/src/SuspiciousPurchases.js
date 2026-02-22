import { useState } from 'react';
import { PropTypes } from 'prop-types';
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

import findSuspiciousPurchases from './find-suspicious-purchases.js';

const SuspiciousPurchases = ({ purchases }) => {
  const [ sortedColumn, setSortedColumn ] = useState(null);
  const [ sortDirection, setSortDirection ] = useState(null);

  const suspiciousPurchases = findSuspiciousPurchases(purchases);
  return (
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
  );
};

SuspiciousPurchases.propTypes = {
  purchases: PropTypes.arrayOf(PropTypes.shape({
    amount: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    customerId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  })).isRequired,
};

export default SuspiciousPurchases;
