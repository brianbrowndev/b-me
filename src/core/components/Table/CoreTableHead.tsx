import React from 'react';
import { TableHead, TableRow, TableCell, TableSortLabel } from '@material-ui/core';

export interface HeadRow {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

export type TableHeaderOrder  = 'asc' | 'desc';


interface CoreTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: TableHeaderOrder;
  orderBy: string;
  headRows: HeadRow[];
}

function CoreTableHead(props: CoreTableProps) {
  const { headRows, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
       {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default CoreTableHead;