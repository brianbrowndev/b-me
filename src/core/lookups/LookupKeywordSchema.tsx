import { TextFieldSchema, FormSchema } from "../components/forms/SchemaForm";
import { ObjectEntity } from "../components/forms/ObjectEntityType";
import { LookupEntity } from "../components/forms/Lookup";

const propertyOf = (e: keyof LookupEntity) => e;

export const lookupKeywordSchema = {
  title: '',
  properties: {
    [propertyOf('name')]: {
        title: "Name",
        type: "text",
        required: true
    } as TextFieldSchema,
    [propertyOf('keyword')]: {
        title: "Keyword",
        type: "text",
        required: true
    } as TextFieldSchema,
  },
  object: {}
} as FormSchema<ObjectEntity>;
