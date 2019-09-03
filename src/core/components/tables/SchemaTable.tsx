import React, { useState, useEffect, useContext, Fragment, useRef } from 'react';
import { Theme, makeStyles, createStyles, Paper, Table, TableRow, TableCell, TableBody, TablePagination } from '@material-ui/core';
import { FormSchema } from '../forms/SchemaForm';
import CoreTableHead, { HeadRow, TableHeaderOrder } from './CoreTableHead';
import { AuthContext } from '../../Auth';
import { EditModalRef, EditModal } from '../forms/EditModal';
import EditMenu from '../forms/EditMenu';
import AppSnackbar from '../AppSnackbar';
import AddModal from '../forms/AddModal';

export type PaginatedResult = {count:number, items:{[key:string]:any}[]}

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

interface SchemaTableProps {
  schema: FormSchema;
  rowsPerPage?: number;
  columnSort?: string;
  getRows(sort:string, page:number):Promise<PaginatedResult>
  getEntitySchema(obj:{[key:string]:any}): FormSchema;
  deleteEntity(obj:{[key:string]:any}): Promise<void>;
}

const defaultRowsPerPage = 25;

function SchemaTable({schema, rowsPerPage, columnSort, getRows, getEntitySchema, deleteEntity} : SchemaTableProps) {
  const classes = useStyles();

  const [rows, setRows] = useState<Array<{[key:string]:any}>>([]);
  const [addedRow, setAddedRow] = useState<{[key:string]:any}>();

  // table
  const [headRows, setHeadRows] = useState<HeadRow[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [sort, setSort] = React.useState(columnSort || "id_desc");
  const [order, setOrder] = React.useState<TableHeaderOrder>('desc');
  const [orderBy, setOrderBy] = React.useState<string>('id');

  useEffect(() => {
    setHeadRows(Object.entries(schema.properties).map(([property, fieldSchema]) => (
      {id: property, numeric:false, disablePadding: false, label: fieldSchema.title} as HeadRow
    )));
  }, [schema])

  useEffect(
    (() => {
      getRows(sort, page + 1).then(result => {
        setRows(result.items);
        setTotalCount(result.count);
      }).catch(err => {
        setAppMessage('Unexpected error fetching rows.');
        setRows([]);
      });
    }), 
    [sort, page, getRows, addedRow] 
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
  const modalRef = useRef<EditModalRef>(null);
  const [appMessage, setAppMessage] = React.useState('');
  const [editSchema, setEditSchema] = React.useState();

  useEffect(() => {
    if (authContext.authenticated)
      setHeadRows(prevHeadRows => [
        ...prevHeadRows,
        { id: 'actions', numeric: false, disablePadding: false, label: '' },
      ]);
    else {
      setHeadRows(prevHeadRows => [...prevHeadRows]);
    }
  }, [authContext.authenticated])

  function handleEdit(row: {[key:string]:any}) {
    setEditSchema(getEntitySchema(row));
    if (modalRef && modalRef.current) {
      modalRef.current.handleOpen();
    }
  }

  function handleDelete(row: {[key:string]:any}) {
    deleteEntity(row).then(() => {
      setAppMessage('Entity deleted.')
      setRows(prevRows  => prevRows.filter(b => b.id !== row.id));
    }).catch(err => {
      console.error(err);
      setAppMessage('Delete failed, unexpected error.')
    })
  }

  function handleOnEditSaveSuccess(row: {[key:string]:any}) {
    setAppMessage('Entity saved.')
    setRows(prevRows  => prevRows.map(e => {
        if (e.id === row.id) {
            return row;
        }
        return e;
    }));
  }

  function handleOnAddSuccess(row: {[key:string]:any}) {
    setAppMessage('Entity added.')
    setAddedRow(row);
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
            {rows.map(row => (
              <TableRow key={row.id}>
                {Object.entries(schema.properties).map(([property, fieldSchema]) => 
                  <TableCell key={property}>{fieldSchema.get ? fieldSchema.get(row[property]) : row[property]}</TableCell>
                )}
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
          count={totalCount}
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
      <EditModal ref={modalRef} schema={editSchema} onSaveSuccess={handleOnEditSaveSuccess} />
      <AddModal schema={schema} onSaveSuccess={handleOnAddSuccess} />
    </Fragment>
  );
}

export default SchemaTable;
