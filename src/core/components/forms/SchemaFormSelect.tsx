import React  from 'react';
import { SchemaFieldProps } from './SchemaField';
import FormSelect from './FormSelect';
import { SelectFieldSchema } from './SchemaForm';

export default function SchemaFormSelect({property, schema, obj, onChange, error}: SchemaFieldProps<SelectFieldSchema>) {
  
  const handleChange = (selectObj: any) => onChange({[property]:selectObj});
  return <FormSelect
      label={schema.title}
      error={error}
      required={schema.required}
      id={property}
      options={schema.options}
      obj={obj[property]}
      valueProperty='id'
      labelProperty='name'
      onChange={handleChange}
    />
}