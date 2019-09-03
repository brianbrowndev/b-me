import React from 'react';
import { BookAuthor } from '../common/client';
import BookApi from '../common/client/BookApi';
import { lookupSchema } from '../core/lookups/LookupSchema';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';


const BookAuthorSchemaContext = React.createContext({} as EditSchemaContextProps<BookAuthor>);

function BookAuthorSchemaContextProvider ({children}: {children:JSX.Element}) {
  const add = (o: BookAuthor) => BookApi.createAuthor(o);
  const save = (o: BookAuthor) => BookApi.updateAuthor(o.id as number, o);

  const contextProps = {
    get: (o?:BookAuthor) => {
      return {
        ...lookupSchema, 
        object: o || {}, 
        title: o ? 'Edit Book Author' : 'New Book Author',
        save: o ? save : add
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
