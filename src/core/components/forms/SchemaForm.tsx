import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import FormAppBar from "./FormAppBar";
import FormOptionType from "./FormOptionType";
import SchemaFormField from "./fields/SchemaField";
import AppSnackbar from "../AppSnackbar";
import { ObjectEntity } from "./ObjectEntityType";
import currencyFormatter from "../formatters/CurrencyFormatter";
import numberFormatter from "../formatters/NumberFormatter";
import getLookupName from "./lookups/getLookupName";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflow: "auto",
      height: "100%",
    },
    form: {},
    formControls: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2),
      "& > div": {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    fab: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

export interface FormSchema<T> {
  type: "EDIT" | "ADD" | "FILTER";
  title: string;
  properties: { [key: string]: FieldSchema };
  object: T;
  save(obj: { [key: string]: any }): Promise<any>;
}

type FieldType =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "date"
  | "currency"
  | "select-menu"
  | "switch";

export const FieldConstructor = {
  option: (obj: any, label: string, value: string | number | undefined) =>
    ({ ...obj, label: label, value: value } as FormOptionType),
  currency: (props: FieldConstructorOptions) =>
    ({
      required: false,
      ...props,
      type: "currency",
      getVal: (value) => currencyFormatter.format(value),
    } as CurrencyFieldSchema),
  date: (props: FieldConstructorOptions) =>
    ({
      required: false,
      ...props,
      type: "date",
    } as DateFieldSchema),
  multiselect: (props: SelectFieldConstructorOptions) =>
    ({
      required: false,
      ...props,
      type: "multiselect",
      getVal: getLookupName,
    } as MultiSelectFieldSchema),
  number: (props: FieldConstructorOptions) =>
    ({
      required: false,
      ...props,
      type: "number",
      getVal: (value) => numberFormatter.format(value),
    } as NumberFieldSchema),
  select: (props: SelectFieldConstructorOptions) =>
    ({
      required: false,
      ...props,
      type: "select",
    } as SelectFieldSchema),
  text: (props: FieldConstructorOptions) =>
    ({
      required: false,
      ...props,
      type: "text",
    } as TextFieldSchema),
};

export type FieldConstructorOptions = Omit<FieldSchema, "type">;
export type SelectFieldConstructorOptions = Omit<SelectFieldSchema, "type">;

export interface FieldSchema {
  title: string;
  type: FieldType;
  required?: boolean;
  error?: string;
  helperText?: string;
  // method to retrieve value
  getVal?(value: any): any;
  // modify values on load/save
  load?(value: any): any; // optional set value on load
  transform?(
    changeObj: ObjectEntity | ObjectEntity[]
  ): string | number | string[] | number[]; // optional transform value on submit
}

export interface TextFieldSchema extends FieldSchema {
  type: "text";
}

export interface SwitchFieldSchema extends FieldSchema {
  type: "switch";
}

export interface CurrencyFieldSchema extends FieldSchema {
  type: "currency";
}

export interface NumberFieldSchema extends FieldSchema {
  type: "number";
}

export interface DateFieldSchema extends FieldSchema {
  type: "date";
}

export interface SelectFieldSchema extends FieldSchema {
  type: "select";
  options: FormOptionType[];
}

export interface SelectMenuFieldSchema extends FieldSchema {
  type: "select-menu";
  options: FormOptionType[];
}

export interface MultiSelectFieldSchema extends FieldSchema {
  type: "multiselect";
  options: FormOptionType[];
}

interface SchemaFormProps<T> {
  schema: FormSchema<T>;
  onCancel(): void;
  onSaveSuccess(obj: { [key: string]: any }): void;
  onChange?(
    obj: { [key: string]: any },
    changeObj: { [key: string]: any }
  ): void;
  saveText?: string;
}

export default function SchemaForm<T extends ObjectEntity>({
  schema,
  onCancel,
  onSaveSuccess,
  onChange,
  saveText,
}: SchemaFormProps<T>) {
  const classes = useStyles();

  const [obj, setObject] = useState<T>({} as T);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [appMessage, setAppMessage] = React.useState("");

  useEffect(() => {
    // Modify value on load, if needed
    const load = (): T => {
      let result = { ...schema.object };
      Object.entries(schema.properties).forEach(([prop, fieldSchema]) => {
        if (fieldSchema.load) {
          (result as ObjectEntity)[prop] = fieldSchema.load(
            schema.object[prop]
          );
        }
      });
      return result;
    };
    setObject(load());
  }, [schema.object, schema.properties]);

  const handleChange = (changeObj: { [key: string]: any }) => {
    const updatedObj = { ...obj, ...changeObj };
    setObject(updatedObj);
    // propogate changes up, in the case we need to update schema on value change
    if (onChange) {
      onChange(updatedObj, changeObj);
    }
  };
  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    setIsSaving(true);
    evt.stopPropagation();
    evt.preventDefault();
    const passed = validate();
    if (!passed) {
      setIsSaving(false);
      return;
    }
    const saveObj = transform();
    schema
      .save(saveObj)
      .then((result) => {
        onSaveSuccess(result || saveObj);
      })
      .catch((err) => {
        console.error(err);
        setAppMessage("Failed to save, unexpected error.");
        setIsSaving(false);
      });
  };

  const validate = (): boolean => {
    let errors: { [key: string]: any } = {};
    Object.entries(schema.properties).forEach(([prop, fieldSchema]) => {
      if (
        fieldSchema.required &&
        (obj[prop] === undefined || obj[prop] === null || obj[prop] === "")
      ) {
        errors[prop] = `${fieldSchema.title} is required.`;
      } else if (
        fieldSchema.type === "currency" &&
        !!isNaN(obj[prop] - parseFloat(obj[prop]))
      ) {
        errors[prop] = `${fieldSchema.title} must be a number.`;
      }
    });
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  // Modify value on submit, if needed
  const transform = (): T => {
    let result = { ...obj };
    Object.entries(schema.properties).forEach(([prop, fieldSchema]) => {
      if (fieldSchema.transform) {
        (result as ObjectEntity)[prop] = fieldSchema.transform(obj[prop]);
      }
    });
    return result;
  };

  return (
    <Fragment>
      <div className={classes.root}>
        <form
          className={classes.form}
          onSubmit={handleSubmit}
          noValidate={true}
        >
          <FormAppBar
            title={schema.title}
            onCancel={onCancel}
            isSaving={isSaving}
            saveText={saveText}
          />
          <div className={classes.formControls}>
            {Object.entries(schema.properties).map(([k, v]) => (
              <SchemaFormField
                property={k}
                obj={obj}
                schema={v}
                onChange={handleChange}
                key={k}
                error={error[k]}
              />
            ))}
          </div>
        </form>
      </div>
      <AppSnackbar message={appMessage} onClose={() => setAppMessage("")} />
    </Fragment>
  );
}
