import React, { useEffect, useState } from 'react';
import { FormSchema, SelectFieldSchema, TextFieldSchema, MultiSelectFieldSchema, DateFieldSchema, CurrencyFieldSchema } from '../core/components/forms/SchemaForm';
import FormOptionType from '../core/components/forms/FormOptionType';
import { TransactionRecord, Bank, TransactionCategory, User } from '../common/client';
import { LookupEntity } from '../core/components/forms/lookups/LookupEntity.interface';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';
import { Omit } from '@material-ui/types';
import getLookupName from '../core/components/forms/lookups/getLookupName';
import {TransactionApi, BankApi, TransactionCategoryApi} from '../common/client/FinanceApi';
import {UserApi} from '../common/client/AdminApi';
import FormYearOptions from '../core/components/forms/FormYearOptions';
import currencyFormatter from '../core/components/formatters/CurrencyFormatter';
import FormMonthOptions from '../core/components/forms/FormMonthOptions.tsx';

export interface TransactionFilter extends Omit<TransactionRecord, 'bank'|'category'|'user'|'date' | 'description'> {
  description: string;
  banks: Bank[];
  categories: TransactionCategory[];
  users: User[];
  years: LookupEntity[];
  months: LookupEntity[];
} 

const TransactionSchemaContext = React.createContext({} as EditSchemaContextProps<TransactionRecord | TransactionFilter>);

const propertyOf = (e: keyof TransactionRecord) => e;

function TransactionSchemaContextProvider ({children}: {children:JSX.Element}) {

  const [users, setUsers] = useState<FormOptionType[]>([]);
  const [categories, setCategories] = useState<FormOptionType[]>([]);
  const [banks, setBanks] = useState<FormOptionType[]>([]);


  useEffect(
    (() => {
      const setOption = (obj:any, label:string, value: string | number | undefined) => ({...obj, label:label, value:value} as FormOptionType);
      Promise.all([BankApi.getBanks(), TransactionCategoryApi.getTransactionCategories(), UserApi.getUsers()]).then(
        ([banks, categories, users]) => {
          setBanks(banks.map(r => setOption(r, r.name as string, r.id)));
          setCategories(categories.map(r => setOption(r, r.name as string, r.id)));
          setUsers(users.map(r => setOption(r, r.name as string, r.id)));
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
      [propertyOf('date')]: {
        title: "Date",
        type: "date",
        required: true
      } as DateFieldSchema,
     [propertyOf('amount')]: {
        title: "Amount",
        type: "currency",
        required: true,
        getVal: (value => currencyFormatter.format(value)),
      } as CurrencyFieldSchema,
     [propertyOf('description')]: {
        title: "Decription",
        type: "text",
        required: true
      } as TextFieldSchema,
      [propertyOf('category')]: {
        title: "Category",
        type: "select",
        options: categories,
        required: true,
        getVal: getLookupName
      } as SelectFieldSchema,
       [propertyOf('bank')]: {
        title: "Bank",
        type: "select",
        options: banks,
        required: true,
        getVal: getLookupName
      } as SelectFieldSchema,
      [propertyOf('user')]: {
        title: "User",
        type: "select",
        options: users,
        required: true,
        getVal: getLookupName
      } as SelectFieldSchema,
    },
    object: {} as TransactionRecord
  } as FormSchema<TransactionRecord>;

  const filterSchema = {
    title: 'Filter Transactions',
    properties: {
      [propertyOf('description')]: {
        title: "Name",
        type: "text",
      } as TextFieldSchema,
      banks: {
        title: "Banks",
        type: "multiselect",
        options: banks,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      categories: {
        title: "Categories",
        type: "multiselect",
        options: categories,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      user: {
        title: "Users",
        type: "multiselect",
        options: users,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      years: {
        title: "Years",
        type: "multiselect",
        required: false,
        options: FormYearOptions,
      } as MultiSelectFieldSchema,
      months: {
        title: "Months",
        type: "multiselect",
        required: false,
        options: FormMonthOptions,
      } as MultiSelectFieldSchema


    },
    object: {description:'', banks:[], categories:[], users:[], years:[], months:[]} as TransactionFilter,
    save: (book: TransactionRecord) => Promise.resolve(null) // Bypass saving, and apply the filter higher up in a get request
  } as FormSchema<TransactionFilter>;

  const add = (obj: TransactionRecord) => TransactionApi.createTransaction(obj);
  const save = (obj: TransactionRecord) => TransactionApi.updateTransaction(obj.id as number, obj);

  const schemaEditProps = {
    get: action => {
      switch (action.type) {
        case 'ADD':
          return {
            ...schema, 
            object: {}, 
            title: 'New Transaction',
            save: add
          } as FormSchema<TransactionRecord>
        case 'EDIT':
          return {
            ...schema, 
            object: action.obj as any, 
            title: 'Edit Transaction',
            save: save
          }as FormSchema<TransactionRecord>
        case 'FILTER':
          return {
            ...filterSchema, 
            title: 'Filter Transactions',
          } as FormSchema<TransactionFilter>
      }
    },
  } as EditSchemaContextProps<TransactionRecord | TransactionFilter>;

  return (
    <TransactionSchemaContext.Provider value={{...schemaEditProps}}>
      {children}
    </TransactionSchemaContext.Provider>
  )
}

export { TransactionSchemaContext, TransactionSchemaContextProvider};
