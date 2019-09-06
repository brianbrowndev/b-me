import { LookupEntity } from "./LookupEntity.interface";

export default function getLookupName(value:LookupEntity | null) {
  return value ? value.name : null;
}