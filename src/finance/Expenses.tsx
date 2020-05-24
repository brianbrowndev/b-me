import React, { Fragment, useEffect, useContext, useState, useRef } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, Paper, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { FinanceApi } from '../common/client/FinanceApi';
import { ExpenseSummary, Expense } from '../common/client';
import { SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import { ExpenseSchemaContext, ExpenseFilter, ExpenseSchemaContextProvider } from './ExpensesSchemaContext';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';
import CoreTableToolbar from '../core/components/tables/CoreTableToolbar';
import CoreTableHead, { HeadRow } from '../core/components/tables/CoreTableHead';
import currencyFormatter from '../core/components/formatters/CurrencyFormatter';
import withProvider from '../core/components/withProvider';
import clsx from 'clsx';
import {TransactionModalRef, TransactionModal} from './TransactionsModal';

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
    positive: {
      color: 'red'
    },
    negative: {
      color: 'green'
    },
    row: {
      cursor: 'pointer'
    }

  })
});

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getSorting(order:string, orderBy:string) {
  return order === 'desc' ? (a:any, b:any) => desc(a, b, orderBy) : (a:any, b:any) => -desc(a, b, orderBy);
}


function FinanceExpenses () {
  const classes = useStyles();


  const schemaContext = useContext(ExpenseSchemaContext);



  const [schema, setSchema] = useState<FormSchema<Expense>>(() => schemaContext.get({type:'ADD'}));
  const [filterSchema, setFilterSchema] = useState<FormSchema<ExpenseFilter>>(() => schemaContext.get({type:'FILTER'}));
  const [filterObj, setFilterObj] = useState<ExpenseFilter>(() => schemaContext.get<ExpenseFilter>({type:'FILTER'}).object);
  const [config, setConfig] = React.useState<SchemaTableConfig>(schemaTableConfig);
  const [expenseSummary, setExpenseSummary] = React.useState<ExpenseSummary>({expenses:[], plannedAmount: 0, totalActualAmount:0, remainder:0} as ExpenseSummary);
  const [expense, setExpense] = React.useState<Expense | null>(null);
  const [headRows, setHeadRows] = useState<HeadRow[]>(() => createHeadRows());

  const modalRef = useRef<TransactionModalRef>(null);


  useEffect(
    (() => {
      FinanceApi.getExpenseSummary(
        filterObj.years.map(o => o.id as string),
        filterObj.months.map(o => o.id as string),
        filterObj.categories.map(b => b.id as number)
      ).then(result => setExpenseSummary(result))
    }), 
    [filterObj]
  );

  // the use effect will catch async lookups that need to be bound to the schema
  useEffect(() => {
    setSchema(schemaContext.get({type:'ADD'}));
    setFilterSchema(schemaContext.get({type:'FILTER'}));
  }, [schemaContext]);

  function handleRequestSort(event: React.MouseEvent<unknown>, property:string) {
    const isDesc = config.orderBy === property && config.order === 'desc';
    const newOrder = isDesc ? 'asc' : 'desc';
    var expenses = [...expenseSummary.expenses || []].sort(getSorting(newOrder, property))
    setExpenseSummary({...expenseSummary, expenses:expenses});
    setConfig({...config, order:newOrder, orderBy:property, sort:`${property}_${newOrder}`, pageNumber:0})
  }


  const handleOnFilter = (obj: ObjectEntity) => {
    setFilterObj({...obj as ExpenseFilter});
    setFilterSchema({...filterSchema, object:obj as ExpenseFilter});
  };

  const handleOnView = (obj: Expense) => {
    setExpense(obj)
    // if (modalRef && modalRef.current) {
      // modalRef.current.handleOpen();
    // }
  }


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
        <span ><strong>Difference:</strong>&nbsp;<span className={clsx((expenseSummary.remainder || 0) < 0 ? classes.positive : classes.negative)}>{currencyFormatter.format(expenseSummary.remainder || 0)}</span></span>
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
              <TableRow key={idx} onClick={() => handleOnView(row)} className={classes.row}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.categoryName}</TableCell>
                  <TableCell>{currencyFormatter.format(row.plannedAmount || 0)}</TableCell>
                  <TableCell>{currencyFormatter.format(row.actualAmount || 0)}</TableCell>
                  <TableCell className={clsx((row.remainder || 0) < 0 ? classes.positive : classes.negative)}>{currencyFormatter.format(row.remainder || 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <TransactionModal ref={modalRef} expense={expense}  onClose={() => setExpense(null)}/>
    </Fragment>

  )

}

export default withProvider(FinanceExpenses, ExpenseSchemaContextProvider);