import React from 'react';
import { BookAuthor } from '../common/client';
import {BookAuthorApi} from '../common/client/BookApi';
import { lookupSchema, lookupFilterSchema } from '../core/components/forms/lookups/LookupSchema';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';


const BookAuthorSchemaContext = React.createContext({} as EditSchemaContextProps<BookAuthor>);

function BookAuthorSchemaContextProvider ({children}: {children:JSX.Element}) {
  const add = (o: BookAuthor) => BookAuthorApi.createAuthor(o);
  const save = (o: BookAuthor) => BookAuthorApi.updateAuthor(o.id as number, o);

  const contextProps = {
    get: action => {
      switch (action.type) {
        case 'ADD':
          return {
            ...lookupSchema, 
            object: {}, 
            type: 'ADD',
            title: 'New Book Author',
            save: add
          }
        case 'EDIT':
          return {
            ...lookupSchema, 
            object: action.obj, 
            type: 'EDIT',
            title: 'Edit Book Author',
            save: save
          }
        case 'FILTER':
          return {
            ...lookupFilterSchema, 
            title: 'Filter Books',
          }
      }
    },
  } as EditSchemaContextProps<BookAuthor>;

  return (
    <BookAuthorSchemaContext.Provider value={{...contextProps}}>
      {children}
    </BookAuthorSchemaContext.Provider>
  )
}

export { BookAuthorSchemaContext, BookAuthorSchemaContextProvider};
