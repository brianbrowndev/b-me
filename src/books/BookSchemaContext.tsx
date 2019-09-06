import React, { useEffect, useState } from 'react';
import { FormSchema, SelectFieldSchema, TextFieldSchema, MultiSelectFieldSchema } from '../core/components/forms/SchemaForm';
import FormOptionType from '../core/components/forms/FormOptionType';
import { Book, BookAuthor, BookStatus, BookCategory } from '../common/client';
import BookApi from '../common/client/BookApi';
import getLookupName, { LookupEntity } from '../core/components/forms/Lookup';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';
import { Omit } from '@material-ui/types';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';

export interface BookFilter extends Omit<Book, 'bookAuthor'|'bookStatus'|'bookCategory'|'readYear'> {
  bookAuthor: BookAuthor[];
  bookStatus: BookStatus[];
  bookCategory: BookCategory[];
  readYear: LookupEntity[];
} 


const BookSchemaContext = React.createContext({} as EditSchemaContextProps<Book | BookFilter>);

const propertyOf = (e: keyof Book) => e;
const readYears = ["2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"].map(year => ({value: year, label:year} as FormOptionType));

function BookSchemaContextProvider ({children}: {children:JSX.Element}) {

  const [authors, setAuthors] = useState<FormOptionType[]>([]);
  const [categories, setCategories] = useState<FormOptionType[]>([]);
  const [statuses, setStatuses] = useState<FormOptionType[]>([]);


  useEffect(
    (() => {
      const setOption = (obj:any, label:string, value: string | number | undefined) => ({...obj, label:label, value:value} as FormOptionType);
      Promise.all([BookApi.getAuthors(), BookApi.getCategories(), BookApi.getStatuses()]).then(
        ([authors, categories, statuses]) => {
          setAuthors(authors.map(r => setOption(r, r.name, r.id)));
          setCategories(categories.map(r => setOption(r, r.name, r.id))) 
          setStatuses(statuses.map(r => setOption(r, r.name, r.id))) 
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
      [propertyOf('readYear')]: {
        title: "Year Read",
        type: "select",
        options: readYears,
        required: true,
        load: (value:string | undefined) => {
          const readYear = value || `${new Date().getFullYear()}`;
          const readYearObj = {id: readYear, name: readYear}
          return readYearObj;
        },
        transform: (obj: ObjectEntity) => obj.id
      } as SelectFieldSchema,
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
      [propertyOf('readYear')]: {
        title: "Year Read",
        type: "multiselect",
        required: false,
        options: readYears,
      } as MultiSelectFieldSchema

    },
    object: {name:'', readYear:[], bookAuthor:[], bookCategory:[], bookStatus:[]} as BookFilter,
    save: (book: Book) => Promise.resolve(null)
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
