import React, { useImperativeHandle, forwardRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import SchemaForm, { FormSchema } from './SchemaForm';

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
    }
  }),
);

export interface EditModalProps {
  schema: FormSchema;
  onSaveSuccess(obj:{[key:string]:any}):void;
}

export interface EditModalRef {
  handleOpen (): void
}

const EditModal = forwardRef(({schema, onSaveSuccess}:EditModalProps, ref) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  useImperativeHandle(ref, () => ({
    handleOpen() {
      setOpen(true);
    }
  }));

  const handleSave = (obj: {[key:string]:any}) => {
    handleClose();
    onSaveSuccess(obj);
  }

  return (
     <Modal
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <SchemaForm schema={schema} onCancel={handleClose} onSaveSuccess={handleSave}/>
        </div>
      </Modal>
  );
});

export { EditModal};