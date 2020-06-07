import React, { Fragment, useContext, useState, useEffect } from 'react';
import { BookSchemaContext, BookSchemaContextProvider, BookFilter, BooksTableConfig } from './BookSchemaContext';
import { Book } from '../common/client';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import {BookApi} from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';

function Books() {
  const schemaContext = useContext(BookSchemaContext);

  const [filterSchema, setFilterSchema] = useState<FormSchema<BookFilter>>(() => schemaContext.get({type:'FILTER'}));
  const [page, setPage] = React.useState<PaginatedResult>({items:[], count:0} as PaginatedResult);
  const [config, setConfig] = React.useState<BooksTableConfig>({...schemaTableConfig, filter: schemaContext.get<BookFilter>({type:'FILTER'}).object});

  useEffect(
    (() => {
      BookApi.getBookPage(
        config.sort, 
        config.pageNumber + 1, 
        config.rowsPerPage,
        config.filter.name,
        config.filter.bookAuthor.map(b => b.id as number),
        config.filter.bookCategory.map(b => b.id as number),
        config.filter.bookStatus.map(b => b.id as number),
        config.filter.readYear.map(b => b.id as string)
      ).then(result => setPage(result as PaginatedResult))
    }), 
    [config]
  );

  // the use effect will catch async lookups that need to be bound to the schema
  useEffect(() => {
    setFilterSchema(schemaContext.get({type:'FILTER'}));
  }, [schemaContext]);


  const handleGetEntitySchema = (obj?: ObjectEntity) => obj !== undefined ? schemaContext.get({type:'EDIT', obj:obj as Book}) as FormSchema<ObjectEntity> : schemaContext.get({type:'ADD'}) as FormSchema<ObjectEntity>;
  const handleDeleteEntity = (obj: ObjectEntity) => BookApi.deleteBook(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig as BooksTableConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setConfig({...config, filter:obj as BookFilter});
    setFilterSchema({...filterSchema, object:obj as BookFilter});
  };

  return (
    <Fragment>
      <SchemaTable 
        filterSchema={filterSchema as FormSchema<ObjectEntity>} 
        getEntitySchema={handleGetEntitySchema} 
        deleteEntity={handleDeleteEntity} 
        onFilter={handleOnFilter}
        page={page}
        onPage={handleOnPage}
        config={config}
        title="Books"
      />
    </Fragment>
  );
}

export default withProvider(Books, BookSchemaContextProvider);
