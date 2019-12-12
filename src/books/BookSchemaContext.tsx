import React, { useEffect, useState } from 'react';
import { FormSchema, SelectFieldSchema, TextFieldSchema, MultiSelectFieldSchema, DateFieldSchema } from '../core/components/forms/SchemaForm';
import FormOptionType from '../core/components/forms/FormOptionType';
import { Book, BookAuthor, BookStatus, BookCategory } from '../common/client';
import {BookApi, BookAuthorApi, BookStatusApi,BookCategoryApi} from '../common/client/BookApi';
import { LookupEntity } from '../core/components/forms/lookups/LookupEntity.interface';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';
import { Omit } from '@material-ui/types';
import getLookupName from '../core/components/forms/lookups/getLookupName';
import FormYearOptions from '../core/components/forms/FormYearOptions';

export interface BookFilter extends Omit<Book, 'bookAuthor'|'bookStatus'|'bookCategory'|'readYear'> {
  bookAuthor: BookAuthor[];
  bookStatus: BookStatus[];
  bookCategory: BookCategory[];
  readYear: LookupEntity[];
} 


const BookSchemaContext = React.createContext({} as EditSchemaContextProps<Book | BookFilter>);

const propertyOf = (e: keyof Book) => e;

function BookSchemaContextProvider ({children}: {children:JSX.Element}) {

  const [authors, setAuthors] = useState<FormOptionType[]>([]);
  const [categories, setCategories] = useState<FormOptionType[]>([]);
  const [statuses, setStatuses] = useState<FormOptionType[]>([]);


  useEffect(
    (() => {
      const setOption = (obj:any, label:string, value: string | number | undefined) => ({...obj, label:label, value:value} as FormOptionType);
      Promise.all([BookAuthorApi.getAuthors(), BookCategoryApi.getCategories(), BookStatusApi.getStatuses()]).then(
        ([authors, categories, statuses]) => {
          setAuthors(authors.map(r => setOption(r, r.name as string, r.id)));
          setCategories(categories.map(r => setOption(r, r.name as string, r.id))) 
          setStatuses(statuses.map(r => setOption(r, r.name as string, r.id))) 
        }
      ).catch(err => {
        // TODO - error handling for user
        console.log(err);
      })
    }), []
  );

  const schema = {
    title: '',
    properties: {
      [propertyOf('name')]: {
        title: "Name",
        type: "text",
        required: true
      } as TextFieldSchema,
      [propertyOf('bookAuthor')]: {
        title: "Author",
        type: "select",
        options: authors,
        required: true,
        getVal: getLookupName
      } as SelectFieldSchema,
      [propertyOf('bookCategory')]: {
        title: "Category",
        type: "select",
        options: categories,
        required: true,
        getVal: getLookupName
      } as SelectFieldSchema,
      [propertyOf('bookStatus')]: {
        title: "Status",
        type: "select",
        options: statuses,
        required: true,
        getVal: getLookupName
      } as SelectFieldSchema,
      [propertyOf('readDate')]: {
        title: "Read Date",
        type: "date",
        required: true
      } as DateFieldSchema,
    },
    object: {} as Book
  } as FormSchema<Book>;

  const filterSchema = {
    title: 'Filter Books',
    properties: {
      [propertyOf('name')]: {
        title: "Name",
        type: "text",
      } as TextFieldSchema,
      [propertyOf('bookAuthor')]: {
        title: "Author",
        type: "multiselect",
        options: authors,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      [propertyOf('bookCategory')]: {
        title: "Category",
        type: "multiselect",
        options: categories,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      [propertyOf('bookStatus')]: {
        title: "Status",
        type: "multiselect",
        options: statuses,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      readYear: {
        title: "Year Read",
        type: "multiselect",
        required: false,
        options: FormYearOptions,
      } as MultiSelectFieldSchema

    },
    object: {name:'', readYear:[], bookAuthor:[], bookCategory:[], bookStatus:[]} as BookFilter,
    save: (book: Book) => Promise.resolve(null) // Bypass saving, and apply the filter higher up in a get request
  } as FormSchema<BookFilter>;

  const add = (book: Book) => BookApi.createBook(book);
  const save = (book: Book) => BookApi.updateBook(book.id as number, book);

  const bookEditProps = {
    get: action => {
      switch (action.type) {
        case 'ADD':
          return {
            ...schema, 
            object: {}, 
            title: 'New Book',
            save: add
          } as FormSchema<Book>
        case 'EDIT':
          return {
            ...schema, 
            object: action.obj as any, 
            title: 'Edit Book',
            save: save
          }as FormSchema<Book>
        case 'FILTER':
          return {
            ...filterSchema, 
            title: 'Filter Books',
          } as FormSchema<BookFilter>
      }
    },
  } as EditSchemaContextProps<Book | BookFilter>;

  return (
    <BookSchemaContext.Provider value={{...bookEditProps}}>
      {children}
    </BookSchemaContext.Provider>
  )
}

export { BookSchemaContext, BookSchemaContextProvider};
