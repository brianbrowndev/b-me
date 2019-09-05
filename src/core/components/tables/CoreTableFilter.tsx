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

interface CoreTableToolbarProps {
  schema: FormSchema;
}

export default function CoreTableFilter ({ schema }: CoreTableToolbarProps) {
  const classes = useToolbarStyles();
  const modalRef = useRef<EditModalRef>(null);

  const handleOnEditSaveSuccess = (obj: ObjectEntity) => {
    console.log(obj)
  }

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
      <EditModal ref={modalRef} schema={schema} onSaveSuccess={handleOnEditSaveSuccess} saveText="Apply"/>
    </Fragment>
  );
}