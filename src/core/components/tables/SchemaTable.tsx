import React, { useState, useEffect, useContext, Fragment, useRef, useReducer}  from 'react';
import { Theme, makeStyles, createStyles, Paper, Table, TableRow, TableCell, TableBody, TablePagination } from '@material-ui/core';
import { FormSchema } from '../forms/SchemaForm';
import CoreTableHead, { HeadRow, TableHeaderOrder } from './CoreTableHead';
import { AuthContext } from '../../Auth';
import { EditModalRef, EditModal } from '../forms/EditModal';
import EditMenu from '../forms/EditMenu';
import AppSnackbar from '../AppSnackbar';
import AddModal from '../forms/AddModal';
import { ObjectEntity } from '../forms/ObjectEntityType';
import schemaTableReducer from './SchemaTableReducer';
import CoreTableToolbar from './CoreTableToolbar';

export type PaginatedResult = {count:number, items:ObjectEntity[]};
export type SchemaTableConfig =  {pageNumber: number, order:TableHeaderOrder, orderBy:string, sort:string, rowsPerPage:number};

export const schemaTableConfig = {
  pageNumber:0,
  sort: 'id_desc',
  orderBy: 'id',
  order: 'desc',
  rowsPerPage: 15
} as SchemaTableConfig

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

interface SchemaTableProps<T> {
  schema: FormSchema<T>;
  filterSchema?: FormSchema<T>;
  page: PaginatedResult;
  title: string;
  onPage:(config: SchemaTableConfig) => void;
  onFilter?:(obj:T) => void;
  config:SchemaTableConfig;
  getEntitySchema(obj:T): FormSchema<T>;
  deleteEntity(obj:T): Promise<void>;
}

function SchemaTable <T extends ObjectEntity>({schema, filterSchema, onFilter, onPage, title, getEntitySchema, deleteEntity, page, config} : SchemaTableProps<T>) {
  const classes = useStyles();

  const reducer = schemaTableReducer<T>();
  const [state, dispatch] = useReducer(reducer, {rows:[], count:0});

  // table
  const [headRows, setHeadRows] = useState<HeadRow[]>(() => createHeadRows());

  function createHeadRows () {
    return Object.entries(schema.properties).map(([property, fieldSchema]) => (
      {id: property, numeric:false, disablePadding: false, label: fieldSchema.title} as HeadRow
    ));
  }

  useEffect(
    (() => dispatch({type:'LOAD', page:page})), 
    [page] 
  );

  function handleChangePage(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
    onPage({...config, pageNumber:newPage});
  }

  function handleRequestSort(event: React.MouseEvent<unknown>, property:string) {
    const isDesc = config.orderBy === property && config.order === 'desc';
    const newOrder = isDesc ? 'asc' : 'desc';
    onPage({...config, order:newOrder, orderBy:property, sort:`${property}_${newOrder}`, pageNumber:0})
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

  function handleEdit(row: T) {
    setEditSchema(getEntitySchema(row));
    if (modalRef && modalRef.current) {
      modalRef.current.handleOpen();
    }
  }

  function handleDelete(row: T) {
    deleteEntity(row).then(() => {
      setAppMessage('Entity deleted.')
      dispatch({type:'DELETE', row:row});
    }).catch(err => {
      console.error(err);
      setAppMessage('Delete failed, unexpected error.')
    })
  }

  function handleOnEditSaveSuccess(row: T) {
    setAppMessage('Entity saved.')
    dispatch({type:'EDIT', row:row});
  }

  function handleOnAddSuccess(row: T) {
    setAppMessage('Entity added.')
    dispatch({type:'ADD', row:row});
  }

  return (
    <Fragment>
      <Paper className={classes.root}>
        <CoreTableToolbar title={title} filterSchema={filterSchema} onFilter={onFilter} />
        <Table className={classes.table}>
          <CoreTableHead
            headRows={headRows}
            order={config.order}
            orderBy={config.orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {state.rows.map(row => (
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
          rowsPerPageOptions={[config.rowsPerPage]}
          component="div"
          count={state.count}
          rowsPerPage={config.rowsPerPage}
          page={config.pageNumber}
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
