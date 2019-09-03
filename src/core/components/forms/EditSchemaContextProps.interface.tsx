import { FormSchema } from "./SchemaForm";

export default interface EditSchemaContextProps<T> {
  get(o?: T):FormSchema
}