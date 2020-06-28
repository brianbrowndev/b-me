import React from 'react';
import { TextFieldSchema, SelectFieldSchema, FieldSchema, MultiSelectFieldSchema, DateFieldSchema, CurrencyFieldSchema, SelectMenuFieldSchema } from '../SchemaForm';
import SchemaFormSelect from './SchemaFormSelect';
import SchemaFormText from './SchemaFormText';
import SchemaFormMultiSelect from './SchemaFormMultiSelect';
import SchemaFormDate from './SchemaFormDate';
import SchemaFormCurrency from './SchemaFormCurrency';
import SchemaFormSelectMenu from './SchemaFormSelectMenu';

export interface SchemaFieldProps<T> {
  property: string;
  schema: T;
  obj: { [key: string]: any };
  error: string;
  helperText?: string;
  onChange: (obj: { [key: string]: any }) => void;
}

export default function SchemaFormField(props: SchemaFieldProps<TextFieldSchema | MultiSelectFieldSchema | SelectFieldSchema | DateFieldSchema | FieldSchema | CurrencyFieldSchema>) {
  switch (props.schema.type) {
    case 'text':
      return <SchemaFormText  {...(props as SchemaFieldProps<TextFieldSchema>)} />
    case 'currency':
      return <SchemaFormCurrency {...(props as SchemaFieldProps<CurrencyFieldSchema>)} />
    case 'date':
      return <SchemaFormDate {...(props as SchemaFieldProps<DateFieldSchema>)} />
    case 'select':
      return <SchemaFormSelect {...(props as SchemaFieldProps<SelectFieldSchema>)} />
    case 'select-menu':
      return <SchemaFormSelectMenu {...(props as SchemaFieldProps<SelectMenuFieldSchema>)} />
    case 'multiselect':
      return <SchemaFormMultiSelect {...(props as SchemaFieldProps<MultiSelectFieldSchema>)} />
  }
}