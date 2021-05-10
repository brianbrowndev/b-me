import { FormSchema } from "./SchemaForm";

export default interface EditSchemaContextProps<T> {
  get<T>(action: Action<T>): FormSchema<T>;
  delete<T>(obj: T): Promise<void>;
}

type Action<T> = { type: "EDIT"; obj: T } | { type: "ADD" | "FILTER" };
