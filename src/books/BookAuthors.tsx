import React, { Fragment, useContext, useState, useEffect } from 'react';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import BookApi from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';
import { BookAuthorSchemaContextProvider, BookAuthorSchemaContext } from './BookAuthorSchemaContext';
import { BookAuthor } from '../common/client';

function BookAuthors() {
  const schemaContext = useContext(BookAuthorSchemaContext);


  const [schema] = useState<FormSchema>(() => schemaContext.get({type: 'ADD'}));
  const [page, setPage] = React.useState<PaginatedResult>({items:[], count:0} as PaginatedResult);
  const [config, setConfig] = React.useState<SchemaTableConfig>({...schemaTableConfig, sort:'name_asc', orderBy:'name', order:'asc'});

  useEffect(
    (() => {
      BookApi.getAuthorsPage(config.sort, config.pageNumber + 1, config.rowsPerPage).then(result => setPage(result as PaginatedResult))
    }), 
    [config] 
  );

  const handleGetEntitySchema = (obj: ObjectEntity) => schemaContext.get({ type:'EDIT', obj:obj as BookAuthor});
  const handleDeleteEntity = (obj: ObjectEntity) => BookApi.deleteAuthor(obj.id);
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
        title="Book Authors"
      />
    </Fragment>
  );
}

export default withProvider(BookAuthors, BookAuthorSchemaContextProvider);
