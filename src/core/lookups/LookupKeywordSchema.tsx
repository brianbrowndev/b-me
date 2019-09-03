import { TextFieldSchema, FormSchema } from "../components/forms/SchemaForm";

type LookupKeyword = {id?:number | undefined, name:string, keyword:string};
const propertyOf = (e: keyof LookupKeyword) => e;

export const lookupKeywordSchema = {
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
