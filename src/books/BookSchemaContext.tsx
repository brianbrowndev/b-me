import React, { useEffect, useState, useContext } from 'react';
import { FormSchema, SelectFieldSchema, TextFieldSchema } from '../core/components/forms/SchemaForm';
import FormOptionType from '../core/components/forms/FormOptionType';
import { Book } from '../common/client';
import BookApi from '../common/client/BookApi';
import { AuthContext } from '../core/Auth';
import getLookupName from '../core/components/forms/Lookup';

interface BookSchemaContextProps {
  get(book?: Book):FormSchema
}
const BookSchemaContext = React.createContext({} as BookSchemaContextProps);

const propertyOf = (e: keyof Book) => e;
const readYears = ["2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"].map(year => ({value: year, label:year} as FormOptionType));

function BookSchemaContextProvider  (props: any) {
    const authContext = useContext(AuthContext);

    const [authors, setAuthors] = useState<FormOptionType[]>([]);
    const [categories, setCategories] = useState<FormOptionType[]>([]);
    const [statuses, setStatuses] = useState<FormOptionType[]>([]);


    useEffect(
      (() => {
        if (!authContext.authenticated) return
        const setOption = (label:string, value: string | number | undefined) => ({label:label, value:value} as FormOptionType);
        BookApi.getAuthors().then(
          result => setAuthors(result.map(r => setOption(r.name, r.id))) 
        ).catch(err => {
          // TODO - error handling for user
          console.error(err);
        });
        BookApi.getBookCategories().then(
          result => setCategories(result.map(r => setOption(r.name, r.id))) 
        ).catch(err => {
          console.error(err);
        });
        BookApi.getStatuses().then(
          result => setStatuses(result.map(r => setOption(r.name, r.id))) 
        ).catch(err => {
          console.error(err);
        });
      }), 
      [authContext.authenticated] 
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
              get: getLookupName
          } as SelectFieldSchema,
          [propertyOf('bookCategory')]: {
              title: "Category",
              type: "select",
              options: categories,
              required: true,
              get: getLookupName
          } as SelectFieldSchema,
          [propertyOf('bookStatus')]: {
              title: "Status",
              type: "select",
              options: statuses,
              required: true,
              get: getLookupName
          } as SelectFieldSchema,
          [propertyOf('readYear')]: {
              title: "Year Book Read",
              type: "select",
              options: readYears,
              required: true,
              load: (value:string | undefined) => {
                const readYear = props.obj  ? props.obj.readYear : `${new Date().getFullYear()}`;
                const readYearObj = {id: readYear, name: readYear}
                return readYearObj;
              },
              transform: (obj:{[key:string]:any}) => obj.id
          } as SelectFieldSchema,
      },
      object: {}
    } as FormSchema;

  const add = (book: Book) => BookApi.createBook(book);
  const save = (book: Book) => BookApi.updateBook(book.id as number, book);



  const bookEditProps = {
    get: (book?:Book) => {
      return {
        ...schema, 
        object: book || {}, 
        title: book ? 'Edit Book' : 'New Book',
        save: book ? save : add
      }
    },
  } as BookSchemaContextProps;

  return (
    <BookSchemaContext.Provider value={{...bookEditProps}}>
      {props.children}
    </BookSchemaContext.Provider>
  )
}

export { BookSchemaContext, BookSchemaContextProvider};
