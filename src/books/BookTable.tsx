import React, { useState, useEffect, Fragment, useContext } from 'react';
import { Book } from '../common/client';
import BookApi from '../common/client/BookApi';
import { Theme, makeStyles, createStyles, Paper, Table, TableRow, TableCell, TableBody, TablePagination, Fab } from '@material-ui/core';
import CoreTableHead, { HeadRow, TableHeaderOrder } from '../core/components/tables/CoreTableHead';
import { AuthContext } from '../core/Auth';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    },
  })
});

const propertyOf = (e: keyof Book) => e;

const headRows: HeadRow[] = [
  { id: propertyOf('name'), numeric: false, disablePadding: false, label: 'Book' },
  { id: propertyOf('bookAuthor'), numeric: false, disablePadding: false, label: 'Author' },
  { id: propertyOf('bookCategory'), numeric: false, disablePadding: false, label: 'Category' },
  { id: propertyOf('readYear'), numeric: true, disablePadding: false, label: 'Year Book Read' },
];

function BookTable() {
  const classes = useStyles();
  const authContext = useContext(AuthContext);

  const [books, setBooks] = useState<Array<Book>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [totalBookCount, setTotalBookCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [sort, setSort] = React.useState("id_desc");
  const [order, setOrder] = React.useState<TableHeaderOrder>('desc');
  const [orderBy, setOrderBy] = React.useState<string>('id');


  useEffect(
    (() => {
      BookApi.getBooks(sort, page + 1).then(result => {
        setBooks((result.items as Book[]))
        setTotalBookCount(result.count as number)
        setIsLoading(false);
      }).catch(err => {
        setError(`Error fetching books: ${err.message}`)
        setIsLoading(false);
        setBooks([]);
      });
    }), 
    [sort, page, rowsPerPage] 
  );

  function handleChangePage(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
    setPage(newPage);
  }

  function handleRequestSort(event: React.MouseEvent<unknown>, property:string) {
    const isDesc = orderBy === property && order === 'desc';
    const newOrder = isDesc ? 'asc' : 'desc';
    setOrder(newOrder);
    setOrderBy(property);
    setSort(`${property}_${newOrder}`);
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <CoreTableHead
          headRows={headRows}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {books.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.bookAuthor.name}</TableCell>
              <TableCell>{row.bookCategory.name}</TableCell>
              <TableCell align="right">{row.readYear}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[25]}
        component="div"
        count={totalBookCount}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'previous page',
        }}
        nextIconButtonProps={{
          'aria-label': 'next page',
        }}
        onChangePage={handleChangePage}
      />
    </Paper>
  );
}

export default BookTable;
