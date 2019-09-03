import React from 'react';
import { BookCategory } from '../common/client';
import BookApi from '../common/client/BookApi';
import { lookupSchema } from '../core/lookups/LookupSchema';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';


const BookCategorySchemaContext = React.createContext({} as EditSchemaContextProps<BookCategory>);

function BookCategorySchemaContextProvider({children}: {children:JSX.Element}) {
  const add = (o: BookCategory) => BookApi.createCategory(o);
  const save = (o: BookCategory) => BookApi.updateCategory(o.id as number, o);

  const bookEditProps = {
    get: (o?:BookCategory) => {
      return {
        ...lookupSchema, 
        object: o || {}, 
        title: o ? 'Edit Book Category' : 'New Book Category',
        save: o ? save : add
      }
    },
  } as EditSchemaContextProps<BookCategory>;

  return (
    <BookCategorySchemaContext.Provider value={{...bookEditProps}}>
      {children}
    </BookCategorySchemaContext.Provider>
  )
}

export { BookCategorySchemaContext, BookCategorySchemaContextProvider};
