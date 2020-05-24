import React, { forwardRef, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal'; 
import { Expense } from '../common/client';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      top:0,
      left:0,
      right:0,
      bottom:0,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
    }
  }),
);

export interface TransactionModalProps {
  expense: Expense | null;
  // onSaveSuccess(obj:{[key:string]:any}):void;
  // saveText?: string;
  onClose():void;
}

export interface TransactionModalRef {
  handleOpen (): void
}

const TransactionModal = forwardRef(({expense, onClose}:TransactionModalProps, ref:any) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState({});

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (expense !== null) {
      setOpen(true);
    }
    else {
      setOpen(false);
    }
  }, [expense])


  // const handleClose = () => {
  //   setOpen(false);
  // };
  // useImperativeHandle(ref, () => ({
  //   handleOpen() {
  //     setOpen(true);
  //   }
  // }));


  return (
     <Modal
        open={open}
        onClose={onClose}
      >
        <div style={modalStyle} className={classes.paper}>
          test
        </div>
      </Modal>
  );
});

export { TransactionModal};