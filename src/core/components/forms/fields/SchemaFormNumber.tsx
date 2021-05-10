import React from "react";
import { TextField } from "@material-ui/core";
import { SchemaFieldProps } from "./SchemaField";
import { NumberFieldSchema } from "../SchemaForm";

export default function SchemaFormNumber({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<NumberFieldSchema>) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ [property]: +event.target.value });
  return (
    <TextField
      required={schema.required}
      error={!!error}
      helperText={schema.helperText}
      id={property}
      label={schema.title}
      value={obj[property] || ""}
      onChange={handleChange}
      variant="filled"
      type="number"
    />
  );
}
