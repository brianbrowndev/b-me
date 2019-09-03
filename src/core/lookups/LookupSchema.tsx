import { TextFieldSchema, FormSchema } from "../components/forms/SchemaForm";

export type Lookup = {id?:number | undefined, name:string};
const propertyOf = (e: keyof Lookup) => e;

export const lookupSchema = {
  title: '',
  properties: {
    [propertyOf('name')]: {
        title: "Name",
        type: "text",
        required: true
    } as TextFieldSchema,
  },
  object: {}
} as FormSchema;
