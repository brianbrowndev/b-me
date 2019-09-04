import React from 'react';
import { BookStatus } from '../common/client';
import BookApi from '../common/client/BookApi';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';
import { lookupKeywordSchema } from '../core/lookups/LookupKeywordSchema';


const BookStatusSchemaContext = React.createContext({} as EditSchemaContextProps<BookStatus>);

function BookStatusSchemaContextProvider ({children}: {children:JSX.Element}) {
  const add = (o: BookStatus) => BookApi.createStatus(o);
  const save = (o: BookStatus) => BookApi.updateStatus(o.id as number, o);

  const contextProps = {
    get: action => {
      switch (action.type) {
        case 'ADD':
          return {
            ...lookupKeywordSchema, 
            object: {}, 
            title: 'New Book Status',
            save: add
          }
        case 'EDIT':
          return {
            ...lookupKeywordSchema, 
            object: action.obj, 
            title: 'Edit Book Status',
            save: save
          }
      }
    },

  } as EditSchemaContextProps<BookStatus>;

  return (
    <BookStatusSchemaContext.Provider value={{...contextProps}}>
      {children}
    </BookStatusSchemaContext.Provider>
  )
}

export { BookStatusSchemaContext, BookStatusSchemaContextProvider};
