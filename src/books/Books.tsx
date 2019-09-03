import React, { Fragment, useContext, useEffect, useState,  } from 'react';
import { BookSchemaContext, BookSchemaContextProvider } from './BookSchemaContext';
import { Book } from '../common/client';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult } from '../core/components/tables/SchemaTable';
import BookApi from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';

function Books() {


  const bookContext = useContext(BookSchemaContext);

  const [schema, setSchema] = useState<FormSchema>();
  useEffect(() => {
    setSchema(bookContext.get());
  }, [bookContext])

  const handleGetRows = (sort:string, page: number) => BookApi.getBooks(sort, page) as Promise<PaginatedResult>;
  const handleGetEntitySchema = (book: Book) => bookContext.get(book);
  const handleDeleteEntity  = (book: Book) => BookApi.deleteBook(book.id as number) as Promise<any>;

  return (
    <Fragment>
      {schema && 
      <SchemaTable schema={schema} getRows={handleGetRows} getEntitySchema={handleGetEntitySchema} deleteEntity={handleDeleteEntity}/>
      }
    </Fragment>
  );
}

export default withProvider(Books, BookSchemaContextProvider);
