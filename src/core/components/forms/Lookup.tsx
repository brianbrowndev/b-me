export type LookupEntity = {id:number | string, name:string, keyword?:string};
export default function getLookupName(value:LookupEntity | null) {
  return value ? value.name : null;
}