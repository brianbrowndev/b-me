import React, { Fragment, useContext } from 'react';
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

interface AddModalProps {
  onAdd:() => void;
};


export default function AddModal({onAdd}:AddModalProps) {
  
  const classes = useStyles();
  const authContext = useContext(AuthContext);

  return (
    <Fragment>
      { authContext.authenticated &&
        <Fab color="secondary" aria-label="add" className={classes.fab} onClick={onAdd}>
          <AddIcon />
        </Fab>
      }
    </Fragment>

 );
}