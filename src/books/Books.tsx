import React, { Fragment, useContext } from 'react';
import BookApi from '../common/client/BookApi';
import { Theme, makeStyles, createStyles, Fab } from '@material-ui/core';
import { AuthContext } from '../core/Auth';
import BookTable from './BookTable';
import BookAddModal from './BookAddModal';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
  })
});

function Books() {
  const classes = useStyles();
  const authContext = useContext(AuthContext);


  return (
    <Fragment>
      <BookTable></BookTable>
      <BookAddModal></BookAddModal>
    </Fragment>
  );
}

export default Books;
