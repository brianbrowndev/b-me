import React, { Fragment, useContext, useState, useEffect } from 'react';
import { BookSchemaContext, BookSchemaContextProvider, BookFilter } from './BookSchemaContext';
import { Book } from '../common/client';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import BookApi from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';

function Books() {
  const schemaContext = useContext(BookSchemaContext);

  const [schema, setSchema] = useState<FormSchema<Book>>(() => schemaContext.get({type:'ADD'}));
  const [filterSchema, setFilterSchema] = useState<FormSchema<BookFilter>>(() => schemaContext.get({type:'FILTER'}));
  const [page, setPage] = React.useState<PaginatedResult>({items:[], count:0} as PaginatedResult);
  const [config, setConfig] = React.useState<SchemaTableConfig>(schemaTableConfig);
  const [filterObj, setFilterObj] = useState<BookFilter>(() => schemaContext.get<BookFilter>({type:'FILTER'}).object);

  useEffect(
    (() => {
      BookApi.getBooks(
        config.sort, 
        config.pageNumber + 1, 
        config.rowsPerPage,
        filterObj.name,
        filterObj.bookAuthor.map(b => b.id as number),
        filterObj.bookCategory.map(b => b.id as number),
        filterObj.bookStatus.map(b => b.id as number),
        filterObj.readYear.map(b => b.id as string)
      ).then(result => setPage(result as PaginatedResult))
    }), 
    [config, filterObj]
  );


  // the use effect will catch async lookups that need to be bound to the schema
  useEffect(() => {
    setSchema(schemaContext.get({type:'ADD'}));
    setFilterSchema(schemaContext.get({type:'FILTER'}));
  }, [schemaContext]);


  const handleGetEntitySchema = (obj: ObjectEntity) => schemaContext.get({type:'EDIT', obj:obj as Book}) as FormSchema<ObjectEntity>;
  const handleDeleteEntity = (obj: ObjectEntity) => BookApi.deleteBook(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setFilterObj({...obj as BookFilter});
    setFilterSchema({...filterSchema, object:obj as BookFilter});
  };

  return (
    <Fragment>
      <SchemaTable 
        schema={schema as FormSchema<ObjectEntity>} 
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
