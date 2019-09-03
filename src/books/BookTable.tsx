import React, { useState, useEffect, useContext, Fragment, useRef } from 'react';
import { Book } from '../common/client';
import BookApi from '../common/client/BookApi';
import { Theme, makeStyles, createStyles, Paper, Table, TableRow, TableCell, TableBody, TablePagination } from '@material-ui/core';
import CoreTableHead, { HeadRow, TableHeaderOrder } from '../core/components/tables/CoreTableHead';
import { AuthContext } from '../core/Auth';
import EditMenu from '../core/components/forms/EditMenu';
import AppSnackbar from '../core/components/AppSnackbar';
import { EditModalRef, EditModal } from '../core/components/forms/EditModal';
import { BookSchemaContext } from './BookSchemaContext';

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

const defaultHeadRows: HeadRow[] = [
  { id: propertyOf('name'), numeric: false, disablePadding: false, label: 'Book' },
  { id: propertyOf('bookAuthor'), numeric: false, disablePadding: false, label: 'Author' },
  { id: propertyOf('bookCategory'), numeric: false, disablePadding: false, label: 'Category' },
  { id: propertyOf('readYear'), numeric: true, disablePadding: false, label: 'Year Book Read' },
];

interface BookTableProps {
  addedBook?: Book;
  rowsPerPage?: number;
}

const defaultRowsPerPage = 25;

function BookTable({addedBook, rowsPerPage} : BookTableProps) {
  const classes = useStyles();

  const [books, setBooks] = useState<Array<Book>>([]);

  // table
  const [headRows, setHeadRows] = useState<HeadRow[]>(defaultHeadRows);
  const [totalBookCount, setTotalBookCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [sort, setSort] = React.useState("id_desc");
  const [order, setOrder] = React.useState<TableHeaderOrder>('desc');
  const [orderBy, setOrderBy] = React.useState<string>('id');

  useEffect(
    (() => {
      BookApi.getBooks(sort, page + 1).then(result => {
        setBooks((result.items as Book[]));
        setTotalBookCount(result.count as number);
      }).catch(err => {
        setAppMessage('Failed to get books.');
        setBooks([]);
      });
    }), 
    [sort, page, addedBook] 
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


  //editing
  const authContext = useContext(AuthContext);
  const bookSchemaContext = useContext(BookSchemaContext);
  const modalRef = useRef<EditModalRef>(null);
  const [appMessage, setAppMessage] = React.useState('');
  const [schema, setSchema] = React.useState();

  useEffect(() => {
    if (authContext.authenticated)
      setHeadRows([
        ...defaultHeadRows,
        { id: 'actions', numeric: false, disablePadding: false, label: '' },
      ])


  }, [authContext.authenticated])

  function handleEdit(book: Book) {
    setSchema(bookSchemaContext.get(book));
    if (modalRef && modalRef.current) {
      modalRef.current.handleOpen();
    }
  }

  function handleDelete(book: Book) {
    BookApi.deleteBook(book.id as number).then(() => {
      setAppMessage('Entity deleted.')
      setBooks(prevBooks => prevBooks.filter(b => b.id !== book.id));
    }).catch(err => {
      console.error(err);
      setAppMessage('Failed to save, unexpected error.')
    })
  }

  function handleOnSaveSuccess(book: Book) {
    setAppMessage('Entity saved.')
    setBooks(prevBooks  => prevBooks.map(e => {
        if (e.id === book.id) {
            return book;
        }
        return e;
    }));
  }

  return (
    <Fragment>
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
                { authContext.authenticated && 
                  <TableCell>
                    <EditMenu onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)}/>
                  </TableCell>
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[rowsPerPage || defaultRowsPerPage]}
          component="div"
          count={totalBookCount}
          rowsPerPage={rowsPerPage || defaultRowsPerPage}
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
      <AppSnackbar 
          message={appMessage}
          onClose={() => setAppMessage('')}
      />
      <EditModal ref={modalRef} schema={schema} onSaveSuccess={handleOnSaveSuccess} />
    </Fragment>
  );
}

export default BookTable;
