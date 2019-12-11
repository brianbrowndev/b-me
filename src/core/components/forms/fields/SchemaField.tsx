import React  from 'react';
import { TextFieldSchema, SelectFieldSchema, FieldSchema, MultiSelectFieldSchema, DateFieldSchema } from '../SchemaForm';
import SchemaFormSelect from './SchemaFormSelect';
import SchemaFormText from './SchemaFormText';
import SchemaFormMultiSelect from './SchemaFormMultiSelect';
import SchemaFormDate from './SchemaFormDate';

export interface SchemaFieldProps<T> {
  property: string;
  schema: T;
  obj: {[key:string]:any};
  error: string;
  onChange: (obj: {[key:string]:any}) => void;
}

export default function SchemaFormField(props: SchemaFieldProps<TextFieldSchema | MultiSelectFieldSchema | SelectFieldSchema | DateFieldSchema | FieldSchema>) {
  switch(props.schema.type) {
    case 'text':
      return <SchemaFormText  {...(props as SchemaFieldProps<TextFieldSchema>)} />
    case 'date':
      return <SchemaFormDate {...(props as SchemaFieldProps<DateFieldSchema>)} />
    case 'select':
      return <SchemaFormSelect {...(props as SchemaFieldProps<SelectFieldSchema>)} />
    case 'multiselect':
      return <SchemaFormMultiSelect {...(props as SchemaFieldProps<MultiSelectFieldSchema>)} />
  }
}