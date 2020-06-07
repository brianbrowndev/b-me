import React  from 'react';
import { SchemaFieldProps } from './SchemaField';
import { SelectFieldSchema, MultiSelectFieldSchema } from '../SchemaForm';
import FormMultiSelect from './FormMultiSelect';

export default function SchemaFormMultiSelect({property, schema, obj, onChange, error}: SchemaFieldProps<SelectFieldSchema | MultiSelectFieldSchema>) {
  
  const handleChange = (selectObj: any) => onChange({[property]:selectObj});
  return <FormMultiSelect
      label={schema.title}
      error={error}
      required={schema.required}
      id={property}
      helperText={schema.helperText}
      options={schema.options}
      items={obj[property]}
      valueProperty='id'
      labelProperty='name'
      onChange={handleChange}
    />
}