import React, { Fragment, useContext, useState, useEffect } from 'react';
import { BookSchemaContext, BookSchemaContextProvider } from './BookSchemaContext';
import { Book } from '../common/client';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, PageConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import BookApi from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';

function Books() {
  const bookContext = useContext(BookSchemaContext);


  const [schema, setSchema] = useState<FormSchema>(() => bookContext.get());
  const [page, setPage] = React.useState<PaginatedResult>({items:[], count:0} as PaginatedResult);
  const [config, setConfig] = React.useState<PageConfig>(schemaTableConfig);

  useEffect(
    (() => {
      BookApi.getBooks(config.sort, config.pageNumber + 1).then(result => setPage(result as PaginatedResult))
    }), 
    [config] 
  );

  // the use effect will 
  useEffect(() => {
    setSchema(bookContext.get())
  }, [bookContext])

  const handleGetEntitySchema = (obj: ObjectEntity) => bookContext.get(obj as Book);
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

export default withProvider(Books, BookSchemaContextProvider);
