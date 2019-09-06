import React, { useRef, Fragment, useState } from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FormSchema } from '../forms/SchemaForm';
import { EditModalRef, EditModal } from '../forms/EditModal';
import { ObjectEntity } from '../forms/ObjectEntityType';

interface CoreTableFilterProps<T> {
  schema: FormSchema<T>;
  onFilter: (obj: T) => void;
}

export default function CoreTableFilter <T extends ObjectEntity>({ schema, onFilter }: CoreTableFilterProps<T>) {
  const modalRef = useRef<EditModalRef>(null);

  const [isActive, setIsActive] = useState(false);

  function handleFilter() {
    if (modalRef && modalRef.current) {
      modalRef.current.handleOpen();
    }
  }

  function handleOnFilter(obj: T) {
    setIsActive(hasFilterApplied(obj));
    onFilter(obj);
  }

  /**
   * Check if the obj returned from the form has a value in a property
   * Since clearing all properties in the form can apply an empty filter
   * Need a way to check whether the user is clearing the filter or applying a value
   * @param obj 
   */
  const hasFilterApplied = (obj: T) => {
    let values = Object.values(obj)
    for (let v of values) {
      if (v !== null && v !== undefined) {
        if (typeof v === 'string' && v !== '') {
          return true;
        } 
        if (typeof v === 'number' || typeof v === 'boolean') {
          return true;
        } 
        if (v instanceof Array && v.length > 0) {
          return true;
        } 
        if (Object.entries(obj).length > 0 && obj.constructor === Object) {
          return true;
        }
      }
    };
    return false;
  }

  return (
    <Fragment>
      <Tooltip title="Filter list">
        <IconButton aria-label="filter list" onClick={handleFilter} color={isActive ? 'secondary' : 'default'}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
      <EditModal ref={modalRef} schema={schema} onSaveSuccess={handleOnFilter} saveText="Apply"/>
    </Fragment>
  );
}