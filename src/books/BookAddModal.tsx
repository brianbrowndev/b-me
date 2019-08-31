import React, { useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';
import { AuthContext } from '../core/Auth';
import BookEditForm from './BookEditForm';

const modalWidth = 800;

function getModalStyle() {
  const top = 10;
  const left = 50;
  const marginLeft = modalWidth * 0.50

  return {
    top: `${top}%`,
    left: `${left}%`,
    // transform: `translate(-${top}%, -${left}%)`,
    marginLeft: -marginLeft
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: modalWidth,
      backgroundColor: theme.palette.background.paper,
      border: `4px double ${theme.palette.secondary.light}`,
      boxShadow: theme.shadows[5],
      // padding: theme.spacing(2, 4, 3),
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    }
  }),
);

export default function BookAddModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const authContext = useContext(AuthContext);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
     { authContext.authenticated &&
        <Fab color="secondary" aria-label="add" className={classes.fab} onClick={handleOpen}>
          <AddIcon />
        </Fab>
      }
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <BookEditForm onCancel={handleClose} onSubmit={()=>{}} />
        </div>
      </Modal>

    </div>
  );
}