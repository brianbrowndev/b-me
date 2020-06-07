import React from 'react';
import { BookStatus } from '../common/client';
import {BookStatusApi} from '../common/client/BookApi';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';
import { lookupKeywordSchema } from '../core/components/forms/lookups/LookupKeywordSchema';


const BookStatusSchemaContext = React.createContext({} as EditSchemaContextProps<BookStatus>);

function BookStatusSchemaContextProvider ({children}: {children:JSX.Element}) {
  const add = (o: BookStatus) => BookStatusApi.createStatus(o);
  const save = (o: BookStatus) => BookStatusApi.updateStatus(o.id as number, o);

  const contextProps = {
    get: action => {
      switch (action.type) {
        case 'ADD':
          return {
            ...lookupKeywordSchema, 
            object: {}, 
            type: 'ADD',
            title: 'New Book Status',
            save: add
          }
        case 'EDIT':
          return {
            ...lookupKeywordSchema, 
            object: action.obj, 
            type: 'EDIT',
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
