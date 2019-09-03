import React, { Fragment, useContext, useState, useEffect } from 'react';
import { BookStatus } from '../common/client';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, PageConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import BookApi from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';
import { BookStatusSchemaContextProvider, BookStatusSchemaContext } from './BookStatusSchemaContext';

function BookStatuses() {
  const schemaContext = useContext(BookStatusSchemaContext);


  const [schema, setSchema] = useState<FormSchema>(() => schemaContext.get());
  const [page, setPage] = React.useState<PaginatedResult>({items:[], count:0} as PaginatedResult);
  const [config, setConfig] = React.useState<PageConfig>(schemaTableConfig);

  useEffect(
    (() => {
      BookApi.getStatusesPage(config.sort, config.pageNumber + 1).then(result => setPage(result as PaginatedResult))
    }), 
    [config] 
  );

  // the use effect will 
  useEffect(() => {
    setSchema(schemaContext.get())
  }, [schemaContext])

  const handleGetEntitySchema = (obj: ObjectEntity) => schemaContext.get(obj as BookStatus);
  const handleDeleteEntity = (obj: ObjectEntity) => BookApi.deleteBook(obj.id);
  const handleOnPage = (pageConfig: PageConfig) => setConfig(pageConfig);

  return (
    <Fragment>
      <SchemaTable 
        schema={schema} 
        getEntitySchema={handleGetEntitySchema} 
        deleteEntity={handleDeleteEntity} 
        page={page}
        onPage={handleOnPage}
        config={config}
      />
    </Fragment>
  );
}

export default withProvider(BookStatuses, BookStatusSchemaContextProvider);
