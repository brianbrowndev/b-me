import React, { useContext, Fragment } from 'react';
import {  Grid, Typography, createStyles, makeStyles, Theme, } from '@material-ui/core';
import { OrgContext, OrgItem } from '../org/OrgContext';
import OrgItemCard from '../org/OrgItemCard';
import RecentBooksCard from '../books/RecentBooksCard';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      marginTop: theme.spacing(2),
    },
    title: {
      marginTop: theme.spacing(4)
    },
  })
});



function Home() {
  const orgContext = useContext(OrgContext);
  const classes = useStyles();

  return (
    <Fragment>
      <Grid container className={classes.container}  justify="center">
        <Grid item spacing={1}>
          <RecentBooksCard></RecentBooksCard>
        </Grid>
      </Grid>
      <Typography color="textSecondary" variant="h5" gutterBottom className={classes.title}>
        Org
      </Typography>
      <Grid container spacing={3} className={classes.container}>
        {orgContext.routes().reduce((a, b) => a.concat(b.items), ([] as OrgItem[])).map(item => 
          <Grid item xs={12} sm key={item.title}>
            <OrgItemCard orgItem={item}></OrgItemCard>
          </Grid>
        )}
      </Grid>
    </Fragment>
  );
}

export default Home;
