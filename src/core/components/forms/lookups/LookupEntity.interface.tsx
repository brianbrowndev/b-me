import { Omit } from '@material-ui/types';
import { ObjectEntity } from '../ObjectEntityType';

export interface LookupEntity extends Omit<ObjectEntity, 'id'> {
  id?: number | string | undefined;
  name: string;
  keyword?: string;
};
export interface LookupEntityFilter extends Omit<LookupEntity, 'id'> {

};

