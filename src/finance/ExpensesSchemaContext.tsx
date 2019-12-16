import React, { useState, useEffect } from 'react';
import { FormSchema,  TextFieldSchema, DateFieldSchema, CurrencyFieldSchema, SelectFieldSchema, MultiSelectFieldSchema } from '../core/components/forms/SchemaForm';
import { TransactionRecord, Expense, TransactionCategory } from '../common/client';
import { LookupEntity } from '../core/components/forms/lookups/LookupEntity.interface';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';
import FormYearOptions from '../core/components/forms/FormYearOptions';
import currencyFormatter from '../core/components/formatters/CurrencyFormatter';
import FormMonthOptions from '../core/components/forms/FormMonthOptions.tsx';
import FormOptionType from '../core/components/forms/FormOptionType';
import { FinanceApi } from '../common/client/FinanceApi';
import getLookupName from '../core/components/forms/lookups/getLookupName';

export interface ExpenseFilter {
  years: LookupEntity[];
  months: LookupEntity[];
  categories: TransactionCategory[];
} 

const ExpenseSchemaContext = React.createContext({} as EditSchemaContextProps<Expense | ExpenseFilter>);

const propertyOf = (e: keyof Expense) => e;

function ExpenseSchemaContextProvider ({children}: {children:JSX.Element}) {

  const [categories, setCategories] = useState<FormOptionType[]>([]);

  useEffect(
    (() => {
      const setOption = (obj:any, label:string, value: string | number | undefined) => ({...obj, label:label, value:value} as FormOptionType);
      Promise.all([FinanceApi.getCategories()]).then(
        ([categories]) => {
          setCategories(categories.map(r => setOption(r, r.name as string, r.id))) 
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
     [propertyOf('categoryName')]: {
        title: "Category",
        type: "text",
        required: true,
      } as TextFieldSchema,
     [propertyOf('plannedAmount')]: {
        title: "Planned Amount",
        type: "currency",
        required: true,
        getVal: (value => currencyFormatter.format(value)),
      } as CurrencyFieldSchema,
      [propertyOf('actualAmount')]: {
        title: "Actual Amount",
        type: "currency",
        required: true,
        getVal: (value => currencyFormatter.format(value)),
      } as CurrencyFieldSchema,
       [propertyOf('remainder')]: {
        title: "Difference",
        type: "currency",
        required: true,
        getVal: (value => currencyFormatter.format(value)),
      } as CurrencyFieldSchema,
    },
    object: {} as TransactionRecord
  } as FormSchema<TransactionRecord>;

  const filterSchema = {
    title: 'Filter Transactions',
    properties: {
      years: {
        title: "Years",
        type: "multiselect",
        required: false,
        options: FormYearOptions,
        getVal: getLookupName
      } as MultiSelectFieldSchema,
      months: {
        title: "Months",
        type: "multiselect",
        required: false,
        options: FormMonthOptions,
        getVal: getLookupName
      } as MultiSelectFieldSchema,
      categories: {
        title: "Categories",
        type: "multiselect",
        options: categories,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
    },
    object: {years:[{id:"2019", name:"2019"}], months:[], categories: []} as ExpenseFilter,
    save: (o: Expense) => Promise.resolve(null) // Bypass saving, and apply the filter higher up in a get request
  } as FormSchema<ExpenseFilter>;

  const schemaEditProps = {
    get: action => {
      switch (action.type) {
        case 'ADD':
          return {
            ...schema, 
            object: {}, 
            title: 'New Transaction',
            save: () => Promise.resolve(null)
          } as FormSchema<Expense>
        case 'FILTER':
          return {
            ...filterSchema, 
            title: 'Filter Transactions',
          } as FormSchema<ExpenseFilter>
      }
    },
  } as EditSchemaContextProps<Expense | ExpenseFilter>;

  return (
    <ExpenseSchemaContext.Provider value={{...schemaEditProps}}>
      {children}
    </ExpenseSchemaContext.Provider>
  )
}

export { ExpenseSchemaContext, ExpenseSchemaContextProvider};
