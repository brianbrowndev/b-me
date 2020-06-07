import React, { useState, useEffect, CSSProperties,  } from 'react';
import { useTheme  } from '@material-ui/core/styles';
import Select from 'react-select';
import FormOptionType from '../FormOptionType';
import { ValueType } from 'react-select/src/types';
import { Control, Menu, MultiValue, NoOptionsMessage, Option, Placeholder, ValueContainer, useSelectStyles } from './SelectComponents'


const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer
};

interface MultiSelectProps {
  label: string;
  id: string;
  options: FormOptionType[]; 
  items: {[key:string]:any}[] | undefined;
  valueProperty: string; 
  labelProperty: string;
  required: boolean;
  error: string;
  helperText?: string;
  onChange(obj:{[key:string]:any}): void;
}

export default function FormMultiSelect({label, id, options, items, valueProperty, labelProperty, required, onChange, error, helperText}: MultiSelectProps) {
  const classes = useSelectStyles();
  const theme = useTheme();

  const [values, setValues] = useState<ValueType<FormOptionType>>([]);
  const selectStyles = {
    input: (base: CSSProperties) => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  useEffect(() => {
    if (items !== undefined) {
      setValues(items.map(item => ({...item, value: item[valueProperty], label:item[labelProperty]})) as any);
    }
  }, [items, valueProperty, labelProperty])

  function handleChange(selected: ValueType<FormOptionType>): void {
    selected = (selected as FormOptionType[]) || [];
    const values = selected.map<{[key:string]:any}>(item => ({...item, [labelProperty]:item.label, [valueProperty]:item.value}))
    onChange(values);
  }

  return (
    <Select
      classes={classes}
      styles={selectStyles}
      inputId={id}
      TextFieldProps={{
        label: label,
        variant: 'filled',
        error: !!error,
        helperText:helperText,
        InputLabelProps: {
          htmlFor: id,
          shrink: true,
        },
      }}
      placeholder={label}
      options={options}
      components={components}
      value={values}
      onChange={handleChange}
      required={required}
      isMulti
    />
);
}