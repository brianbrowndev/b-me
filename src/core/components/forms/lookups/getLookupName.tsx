import { LookupEntity } from "./LookupEntity.interface";

export default function getLookupName(
  value: LookupEntity | LookupEntity[] | null
) {
  if (Array.isArray(value)) {
    return value?.map((v) => v.name).join(", ");
  } else {
    return value?.name;
  }
}
