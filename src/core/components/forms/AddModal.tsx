import React, { Fragment, useContext, useState, useRef, useEffect } from 'react';
import  {EditModal, EditModalProps, EditModalRef } from './EditModal';
import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../Auth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    }
  }),
);

export default function AddModal(props:EditModalProps) {
  const classes = useStyles();
  const authContext = useContext(AuthContext);
  const modalRef = useRef<EditModalRef>(null);

  const handleOpen = () => {
    if (modalRef && modalRef.current) modalRef.current.handleOpen();
  }

  return (
    <Fragment>
      { authContext.authenticated &&
        <Fab color="secondary" aria-label="add" className={classes.fab} onClick={handleOpen}>
          <AddIcon />
        </Fab>
      }
      <EditModal ref={modalRef} {...props} />
    </Fragment>

 );
}