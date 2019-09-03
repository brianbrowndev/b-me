import { PaginatedResult } from "./SchemaTable";
import { ObjectEntity } from "../forms/ObjectEntityType";

type State<T> = {rows:T[], count:number};
type Action<T> = { type: 'LOAD', page: PaginatedResult} | {type: 'ADD' | 'EDIT' | 'DELETE', row: T};

const schemaTableReducer = <T extends ObjectEntity>() => (state:State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case 'LOAD':
      return {rows: action.page.items as T[], count:action.page.count};
      break;
    case 'ADD':
      return {rows: [action.row, ...state.rows], count:state.count + 1};
    case 'EDIT':
      let editRows = state.rows.map(e => {
        if (e.id === action.row.id) {
            return action.row;
        }
        return e;
      });
      return {rows: editRows, count: state.count};
    case 'DELETE':
      let deleteRows = state.rows.filter(r => r.id !== action.row.id);
      return {rows: deleteRows, count: state.count - 1};
    default:
      return state
  }
}

export default schemaTableReducer;