import React  from 'react';
import { TextFieldSchema, SelectFieldSchema, FieldSchema } from '../SchemaForm';
import SchemaFormSelect from './SchemaFormSelect';
import SchemaFormText from './SchemaFormText';

export interface SchemaFieldProps<T> {
  property: string;
  schema: T;
  obj: {[key:string]:any};
  error: string;
  onChange: (obj: {[key:string]:any}) => void;
}

export default function SchemaFormField(props: SchemaFieldProps<TextFieldSchema | SelectFieldSchema | FieldSchema>) {
  switch(props.schema.type) {
    case 'text':
      return <SchemaFormText  {...(props as SchemaFieldProps<TextFieldSchema>)} />
    case 'select':
    case 'multiselect':
      return <SchemaFormSelect {...(props as SchemaFieldProps<SelectFieldSchema>)} />
  }
}