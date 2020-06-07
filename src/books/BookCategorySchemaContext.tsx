import React from 'react';
import { BookCategory } from '../common/client';
import {BookCategoryApi} from '../common/client/BookApi';
import { lookupSchema } from '../core/components/forms/lookups/LookupSchema';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';


const BookCategorySchemaContext = React.createContext({} as EditSchemaContextProps<BookCategory>);

function BookCategorySchemaContextProvider({children}: {children:JSX.Element}) {
  const add = (o: BookCategory) => BookCategoryApi.createCategory(o);
  const save = (o: BookCategory) => BookCategoryApi.updateCategory(o.id as number, o);

  const bookEditProps = {
    get: action => {
      switch (action.type) {
        case 'ADD':
          return {
            ...lookupSchema, 
            object: {}, 
            type: 'ADD',
            title: 'New Book Category',
            save: add
          }
        case 'EDIT':
          return {
            ...lookupSchema, 
            object: action.obj, 
            type: 'EDIT',
            title: 'Edit Book Category',
            save: save
          }
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
