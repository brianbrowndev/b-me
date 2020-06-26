import { TextFieldSchema, FormSchema } from "../SchemaForm";
import { ObjectEntity } from "../ObjectEntityType";
import { LookupEntity } from "./LookupEntity.interface";

const propertyOf = (e: keyof LookupEntity) => e;

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
} as FormSchema<ObjectEntity>;

export const lookupFilterSchema = {
  title: '',
  properties: {
    [propertyOf('name')]: {
      title: "Name",
      type: "text",
    } as TextFieldSchema,
  },
  object: { name: '' },
  save: (o: ObjectEntity) => Promise.resolve(null) // Bypass saving, and apply the filter higher up in a get request
} as FormSchema<LookupEntity>;
