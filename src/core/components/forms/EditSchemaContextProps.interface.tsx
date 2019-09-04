import { FormSchema } from "./SchemaForm";

export default interface EditSchemaContextProps<T> {
  get<T>(action:Action<T>):FormSchema
}

type Action<T> = { type: 'EDIT', obj:T } | {type: 'ADD' | 'FILTER'};


