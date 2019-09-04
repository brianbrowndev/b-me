import React, { Fragment, useContext, useState, useEffect } from 'react';
import { BookSchemaContext, BookSchemaContextProvider } from './BookSchemaContext';
import { Book } from '../common/client';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import BookApi from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';

function Books() {
  const schemaContext = useContext(BookSchemaContext);

  const [schema] = useState<FormSchema>(() => schemaContext.get({type:'ADD'}));
  const [filterSchema] = useState<FormSchema>(() => schemaContext.get({type:'FILTER'}));
  const [page, setPage] = React.useState<PaginatedResult>({items:[], count:0} as PaginatedResult);
  const [config, setConfig] = React.useState<SchemaTableConfig>(schemaTableConfig);

  useEffect(
    (() => {
      BookApi.getBooks(config.sort, config.pageNumber + 1, config.rowsPerPage).then(result => setPage(result as PaginatedResult))
    }), 
    [config] 
  );

  const handleGetEntitySchema = (obj: ObjectEntity) => schemaContext.get({type:'EDIT', obj:obj as Book});
  const handleDeleteEntity = (obj: ObjectEntity) => BookApi.deleteBook(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig);

  return (
    <Fragment>
      <SchemaTable 
        schema={schema} 
        filterSchema={filterSchema} 
        getEntitySchema={handleGetEntitySchema} 
        deleteEntity={handleDeleteEntity} 
        page={page}
        onPage={handleOnPage}
        config={config}
        title="Books"
      />
    </Fragment>
  );
}

export default withProvider(Books, BookSchemaContextProvider);
