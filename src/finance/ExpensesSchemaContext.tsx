import React from 'react';
import { FormSchema,  TextFieldSchema, DateFieldSchema, CurrencyFieldSchema, SelectFieldSchema } from '../core/components/forms/SchemaForm';
import { TransactionRecord, Expense } from '../common/client';
import { LookupEntity } from '../core/components/forms/lookups/LookupEntity.interface';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';
import FormYearOptions from '../core/components/forms/FormYearOptions';
import currencyFormatter from '../core/components/formatters/CurrencyFormatter';
import FormMonthOptions from '../core/components/forms/FormMonthOptions.tsx';

export interface ExpenseFilter {
  year: LookupEntity;
  month: LookupEntity;
} 

const ExpenseSchemaContext = React.createContext({} as EditSchemaContextProps<Expense | ExpenseFilter>);

const propertyOf = (e: keyof Expense) => e;

function ExpenseSchemaContextProvider ({children}: {children:JSX.Element}) {

  const schema = {
    title: '',
    properties: {
      [propertyOf('date')]: {
        title: "Date",
        type: "date",
        required: true
      } as DateFieldSchema,
     [propertyOf('category')]: {
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
      year: {
        title: "Year",
        type: "select",
        required: false,
        options: FormYearOptions,
      } as SelectFieldSchema,
      month: {
        title: "Month",
        type: "select",
        required: false,
        options: FormMonthOptions,
      } as SelectFieldSchema

    },
    object: {year:{id:"2019", name:"2019"}, month:{}} as ExpenseFilter,
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
