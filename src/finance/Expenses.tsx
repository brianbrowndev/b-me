import React, { Fragment, useEffect, useContext, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, Paper, Table, TableBody, TablePagination, TableRow, TableCell } from '@material-ui/core';
import { TransactionApi, FinanceApi } from '../common/client/FinanceApi';
import { ExpenseSummary, Expense } from '../common/client';
import { SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import { ExpenseSchemaContext, ExpenseFilter, ExpenseSchemaContextProvider } from './ExpensesSchemaContext';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';
import CoreTableToolbar from '../core/components/tables/CoreTableToolbar';
import CoreTableHead, { HeadRow } from '../core/components/tables/CoreTableHead';
import currencyFormatter from '../core/components/formatters/CurrencyFormatter';
import withProvider from '../core/components/withProvider';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    total: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
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
function FinanceExpenses () {
  const classes = useStyles();


  const schemaContext = useContext(ExpenseSchemaContext);



  const [schema, setSchema] = useState<FormSchema<Expense>>(() => schemaContext.get({type:'ADD'}));
  const [filterSchema, setFilterSchema] = useState<FormSchema<ExpenseFilter>>(() => schemaContext.get({type:'FILTER'}));
  const [filterObj, setFilterObj] = useState<ExpenseFilter>(() => schemaContext.get<ExpenseFilter>({type:'FILTER'}).object);
  const [config, setConfig] = React.useState<SchemaTableConfig>(schemaTableConfig);


  const [expenseSummary, setExpenseSummary] = React.useState<ExpenseSummary>({expenses:[], plannedAmount: 0, totalActualAmount:0, remainder:0} as ExpenseSummary);

  useEffect(
    (() => {
      FinanceApi.getExpenseSummary(
        filterObj.year.name,
        (filterObj.month.id || "").toString()
      ).then(result => setExpenseSummary(result))
    }), 
    [filterObj]
  );

  function handleRequestSort(event: React.MouseEvent<unknown>, property:string) {
    const isDesc = config.orderBy === property && config.order === 'desc';
    const newOrder = isDesc ? 'asc' : 'desc';
    // onPage({...config, order:newOrder, orderBy:property, sort:`${property}_${newOrder}`, pageNumber:0})
  }



  const handleGetEntitySchema = (obj: ObjectEntity) => schemaContext.get({type:'EDIT', obj:obj as Expense}) as FormSchema<ObjectEntity>;
  const handleDeleteEntity = (obj: ObjectEntity) => TransactionApi.deleteTransaction(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setFilterObj({...obj as ExpenseFilter});
    setFilterSchema({...filterSchema, object:obj as ExpenseFilter});
  };

  const [headRows, setHeadRows] = useState<HeadRow[]>(() => createHeadRows());

  function createHeadRows () {
    return Object.entries(schema.properties).map(([property, fieldSchema]) => (
      {id: property, numeric:false, disablePadding: false, label: fieldSchema.title} as HeadRow
    ));
  }




  return (
    <Fragment>
      <div className={classes.total}>
        <span><strong>Planned Expenses:</strong>&nbsp;{currencyFormatter.format(expenseSummary.plannedAmount || 0)}</span>
        <span><strong>Actual Expenses:</strong>&nbsp;{currencyFormatter.format(expenseSummary.totalActualAmount || 0)}</span>
        <span><strong>Difference:</strong>&nbsp;{currencyFormatter.format(expenseSummary.remainder || 0)}</span>
      </div>
      <Paper className={classes.root}>
        <CoreTableToolbar title="Expenses" filterSchema={filterSchema as FormSchema<ObjectEntity>} onFilter={handleOnFilter} />
        <Table className={classes.table}>
          <CoreTableHead
            headRows={headRows}
            order={config.order}
            orderBy={config.orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {expenseSummary?.expenses?.map((row, idx) => (
              <TableRow key={idx}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.category?.name}</TableCell>
                  <TableCell>{currencyFormatter.format(row.plannedAmount || 0)}</TableCell>
                  <TableCell>{currencyFormatter.format(row.actualAmount || 0)}</TableCell>
                  <TableCell>{currencyFormatter.format(row.remainder || 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* <TablePagination
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
        /> */}
      </Paper>
    </Fragment>

  )

}

export default withProvider(FinanceExpenses, ExpenseSchemaContextProvider);