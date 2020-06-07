import React  from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import { SchemaFieldProps } from './SchemaField';
import { CurrencyFieldSchema } from '../SchemaForm';

export default function SchemaFormCurrency({property, schema, obj, onChange, error}: SchemaFieldProps<CurrencyFieldSchema>) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => onChange({[property]: +event.target.value });
    return <TextField
        required={schema.required}
        error={!!error}
        helperText={schema.helperText}
        id={property}
        label={schema.title}
        value={obj[property] || ''}
        onChange={handleChange}
        variant="filled"
        type="number"
        InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
    />

}