import React, { Fragment, useContext, useState, useEffect } from 'react';
import { BookStatus } from '../common/client';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import {BookStatusApi} from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';
import { BookStatusSchemaContextProvider, BookStatusSchemaContext } from './BookStatusSchemaContext';

function BookStatuses() {
  const schemaContext = useContext(BookStatusSchemaContext);


  const [page, setPage] = React.useState<PaginatedResult>({items:[], count:0} as PaginatedResult);
  const [config, setConfig] = React.useState<SchemaTableConfig>({...schemaTableConfig, sort:'id_asc', order:'asc'});

  useEffect(
    (() => {
      BookStatusApi.getStatusesPage(config.sort, config.pageNumber + 1, config.rowsPerPage).then(result => setPage(result as PaginatedResult))
    }), 
    [config] 
  );

  const handleGetEntitySchema = (obj?: ObjectEntity) => obj !== undefined ? schemaContext.get({type:'EDIT', obj:obj as BookStatus}) as FormSchema<ObjectEntity> : schemaContext.get({type:'ADD'}) as FormSchema<ObjectEntity>;
  const handleDeleteEntity = (obj: ObjectEntity) => BookStatusApi.deleteStatus(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig);

  return (
    <Fragment>
      <SchemaTable 
        getEntitySchema={handleGetEntitySchema} 
        deleteEntity={handleDeleteEntity} 
        page={page}
        onPage={handleOnPage}
        config={config}
        title="Book Statuses"
      />
    </Fragment>
  );
}

export default withProvider(BookStatuses, BookStatusSchemaContextProvider);
