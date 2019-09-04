import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FormAppBar from './FormAppBar';
import FormOptionType from './FormOptionType';
import SchemaFormField from './fields/SchemaField';
import AppSnackbar from '../AppSnackbar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    form: {

    },
    formControls: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
      "& > div": {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
      }
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    }
  }),
);


export interface FormSchema {
  title: string;
  properties: {[key:string]:FieldSchema};
  object: {[key:string]:any};
  save(obj:{[key:string]:any}): Promise<any>; 
}

type FieldType = 'text' | 'select' | 'multiselect';

export interface FieldSchema {
  title: string;
  type: FieldType
  required: boolean;
  error?: string;
  // method to retrieve value
  get?(value:any): any;
  // modify values on load/save
  load?(value:any): any; // optional set value on load
  transform?(changeObj: {[key:string]:any}): {[key:string]:any}; // optional transform value on submit
}

export interface TextFieldSchema extends FieldSchema {
  type: 'text';
}

export interface SelectFieldSchema extends FieldSchema {
  type: 'select';
  options: FormOptionType[];
}

export interface MultiSelectFieldSchema extends FieldSchema {
  type: 'multiselect';
  options: FormOptionType[];
}



interface SchemaFormProps {
  schema: FormSchema;
  onCancel(): void;
  onSaveSuccess(obj:{[key:string]:any}): void;
  saveText?: string;
}

export default function SchemaForm({ schema, onCancel, onSaveSuccess, saveText}: SchemaFormProps) {
  const classes = useStyles();
  
  const [obj, setObject] = useState<{[key:string]:any}>({});
  const [error, setError] = useState<{[key:string]:string}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [appMessage, setAppMessage] = React.useState('');

  useEffect(() => {
    // Modify value on load, if needed
    const load = (): {[key:string]:any} => {
      let result = {...schema.object};
      Object.entries(schema.properties).forEach(([prop, fieldSchema]) =>  {
        if (fieldSchema.load) {
          result[prop] = fieldSchema.load(schema.object[prop]);
        }
      });
      return result;
    } 
    setObject(load());
  }, [schema.object, schema.properties])

  const handleChange = (changeObj: {[key:string]:any}) => {
    setObject({ ...obj, ...changeObj});
  };
  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    setIsSaving(true);
    evt.stopPropagation();
    evt.preventDefault();
    const passed = validate();
    if (!passed) {
      setIsSaving(false);
      return
    };
    const saveObj = transform();
    schema.save(saveObj).then(result => {
      onSaveSuccess(result || saveObj);
    }).catch(err => {
      console.error(err);
      setAppMessage('Failed to save, unexpected error.');
      setIsSaving(false);
    })
  }

  const validate = (): boolean => {
    let errors: {[key:string]:any} = {};
    Object.entries(schema.properties).forEach(([prop, fieldSchema]) =>  {
      if (fieldSchema.required && (obj[prop] === undefined || obj[prop] === null || obj[prop] === '')) {
        errors[prop] = `${fieldSchema.title} is required.`;
      }
    });
    setError(errors);
    return Object.keys(errors).length === 0;
  }


  // Modify value on submit, if needed
  const transform = (): {[key:string]:any} => {
    let result = {...obj};
    Object.entries(schema.properties).forEach(([prop, fieldSchema]) =>  {
      if (fieldSchema.transform) {
        result[prop] = fieldSchema.transform(obj[prop]);
      }
    });
    return result;
  } 


  return (
    <Fragment>
      <div className={classes.root}>
        <form className={classes.form} onSubmit={handleSubmit} noValidate={true}>
          <FormAppBar title={schema.title} onCancel={onCancel} isSaving={isSaving} saveText={saveText}/>
          <div className={classes.formControls}>
            {
              Object.entries(schema.properties).map(([k, v]) => 
                <SchemaFormField property={k} obj={obj} schema={v} onChange={handleChange} key={k} error={error[k]}/>
              )
            }
          </div>
        </form>
      </div>
      <AppSnackbar 
          message={appMessage}
          onClose={() => setAppMessage('')}
      />
    </Fragment>

  );
}