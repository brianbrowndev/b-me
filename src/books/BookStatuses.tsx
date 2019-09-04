import React, { Fragment, useContext, useState, useEffect } from 'react';
import { BookStatus } from '../common/client';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import BookApi from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';
import { BookStatusSchemaContextProvider, BookStatusSchemaContext } from './BookStatusSchemaContext';

function BookStatuses() {
  const schemaContext = useContext(BookStatusSchemaContext);


  const [schema] = useState<FormSchema>(() => schemaContext.get({type:'ADD'}));
  const [page, setPage] = React.useState<PaginatedResult>({items:[], count:0} as PaginatedResult);
  const [config, setConfig] = React.useState<SchemaTableConfig>({...schemaTableConfig, sort:'id_asc', order:'asc'});

  useEffect(
    (() => {
      BookApi.getStatusesPage(config.sort, config.pageNumber + 1, config.rowsPerPage).then(result => setPage(result as PaginatedResult))
    }), 
    [config] 
  );

  const handleGetEntitySchema = (obj: ObjectEntity) => schemaContext.get({type:'EDIT', obj:obj as BookStatus});
  const handleDeleteEntity = (obj: ObjectEntity) => BookApi.deleteStatus(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig);

  return (
    <Fragment>
      <SchemaTable 
        schema={schema} 
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
