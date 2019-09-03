export type LookupEntity = {id:number, name:string, keyword?:string};
export default function getLookupName(value:LookupEntity) {
  return value.name;
}