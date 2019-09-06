import { Omit } from '@material-ui/types';

export interface LookupEntity {
  id?:number | string | undefined;
  name:string;
  keyword?:string;
};
export interface LookupEntityFilter extends Omit<LookupEntity, 'id'> {

};

