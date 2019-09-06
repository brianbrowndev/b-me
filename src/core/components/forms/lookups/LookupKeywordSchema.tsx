import { TextFieldSchema, FormSchema } from "../SchemaForm";
import { ObjectEntity } from "../ObjectEntityType";
import { LookupEntity } from "./LookupEntity.interface";

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
