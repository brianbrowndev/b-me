import React, { useRef, Fragment } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, Tooltip, IconButton } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FormSchema } from '../forms/SchemaForm';
import { EditModalRef, EditModal } from '../forms/EditModal';
import { ObjectEntity } from '../forms/ObjectEntityType';

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
    },
  }),
);

interface CoreTableFilterProps<T> {
  schema: FormSchema<T>;
  onFilter: (obj: T) => void;
}

export default function CoreTableFilter <T extends ObjectEntity>({ schema, onFilter }: CoreTableFilterProps<T>) {
  const classes = useToolbarStyles();
  const modalRef = useRef<EditModalRef>(null);

  function handleFilter() {
    if (modalRef && modalRef.current) {
      modalRef.current.handleOpen();
    }
  }

  return (
    <Fragment>
      <Tooltip title="Filter list">
        <IconButton aria-label="filter list" onClick={handleFilter}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
      <EditModal ref={modalRef} schema={schema} onSaveSuccess={onFilter} saveText="Apply"/>
    </Fragment>
  );
}