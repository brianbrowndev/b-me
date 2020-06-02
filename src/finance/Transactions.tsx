import React, { Fragment, useContext, useState, useEffect } from 'react';
import { TransactionSchemaContext, TransactionFilter, TransactionSchemaContextProvider, TransactionTableConfig, transactionMapping } from './TransactionSchemaContext';
import { TransactionRecord } from '../common/client';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import {TransactionApi} from '../common/client/FinanceApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import currencyFormatter from '../core/components/formatters/CurrencyFormatter';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    total: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  })
});

export type PaginatedFinanceResult = PaginatedResult & {amountTotal:number};

function Transactions() {
  const classes = useStyles();

  const schemaContext = useContext(TransactionSchemaContext);

  const [schema, setSchema] = useState<FormSchema<TransactionRecord>>(() => schemaContext.get({type:'ADD'}));
  const [filterSchema, setFilterSchema] = useState<FormSchema<TransactionFilter>>(() => schemaContext.get({type:'FILTER'}));
  const [page, setPage] = React.useState<PaginatedFinanceResult>({items:[], count:0, amountTotal: 0} as PaginatedFinanceResult);
  const [config, setConfig] = React.useState<TransactionTableConfig>({...schemaTableConfig, sort:'date_desc', orderBy:'date', filter: schemaContext.get<TransactionFilter>({type:'FILTER'}).object});

  useEffect(
    (() => {
      TransactionApi.getTransactions(
        config.sort, 
        config.pageNumber + 1, 
        config.rowsPerPage,
        true,
        config.filter.description,
        config.filter.banks.map(b => b.id as number),
        config.filter.users.map(b => b.id as number),
        config.filter.categories.map(b => b.id as number),
        config.filter.tags.map(b => b.id as number),
        config.filter.years.map(b => b.id as string),
        config.filter.months.map(b => b.id as string)
      ).then(result => setPage({...result, items:result?.items?.map(i => transactionMapping.mapToTransactionTableRecord(i))} as PaginatedFinanceResult))
    }), 
    [config]
  );


  // the use effect will catch async lookups that need to be bound to the schema
  useEffect(() => {
    setSchema(schemaContext.get({type:'ADD'}));
    setFilterSchema(schemaContext.get({type:'FILTER'}));
  }, [schemaContext]);


  const handleGetEntitySchema = (obj: ObjectEntity) => schemaContext.get({type:'EDIT', obj:obj as TransactionRecord}) as FormSchema<ObjectEntity>;
  const handleDeleteEntity = (obj: ObjectEntity) => TransactionApi.deleteTransaction(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig as TransactionTableConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setConfig({...config, pageNumber:0, filter:obj as TransactionFilter});
    setFilterSchema({...filterSchema, object:obj as TransactionFilter});
  };

  return (
    <Fragment>
      <div className={classes.total}>
        <strong>Total:</strong>&nbsp;{currencyFormatter.format(page.amountTotal)}
      </div>
      <SchemaTable 
        schema={schema as FormSchema<ObjectEntity>} 
        filterSchema={filterSchema as FormSchema<ObjectEntity>} 
        getEntitySchema={handleGetEntitySchema} 
        deleteEntity={handleDeleteEntity} 
        onFilter={handleOnFilter}
        page={page}
        onPage={handleOnPage}
        config={config}
        title="Transactions"
      />
    </Fragment>
  );
}

export default withProvider(Transactions, TransactionSchemaContextProvider);
