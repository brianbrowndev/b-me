import React, { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import FormOptionType from "../FormOptionType";
import { MenuItem, FormControl, InputLabel } from "@material-ui/core";

interface SelectProps {
  label: string;
  id: string;
  options: FormOptionType[];
  obj: { [key: string]: any } | undefined;
  valueProperty: string;
  labelProperty: string;
  required: boolean;
  error: string;
  helperText?: string;
  onChange(obj: FormOptionType): void;
}

export default function FormSelectMenu({
  label,
  id,
  options,
  obj,
  valueProperty,
  labelProperty,
  required,
  onChange,
  error,
  helperText,
}: SelectProps) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (obj !== undefined) {
      setValue(obj[valueProperty] || "");
    }
  }, [obj, valueProperty, labelProperty]);

  function handleChange(
    event: React.ChangeEvent<{
      label?: unknown;
      name?: unknown;
      value: unknown;
    }>
  ): void {
    const selected = event.target as FormOptionType;
    onChange({
      ...selected,
      [labelProperty]: selected.label,
      [valueProperty]: selected.value,
    });
  }

  return (
    <FormControl variant="filled">
      <InputLabel id={id + "-label"}>{label}</InputLabel>
      <Select
        id={id}
        placeholder={label}
        value={value}
        onChange={handleChange}
        required={required}
        error={!!error}
      >
        {!required && <MenuItem value="">&nbsp;</MenuItem>}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
