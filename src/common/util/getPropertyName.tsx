const getPropertyName = (obj: {[key:string]:any}, getKey: (obj:any) => string) => {
  let keys: {[key:string]: () => string} = {};
  Object.keys(obj).map(k => keys[k] = () => k);
  return getKey(keys);
}
export default getPropertyName;