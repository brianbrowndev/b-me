import React, { useContext, Fragment } from 'react';
import {  Grid, Typography, } from '@material-ui/core';
import { OrgContext, OrgItem } from '../org/OrgContext';
import OrgItemCard from '../org/OrgItemCard';

function Home() {
  const orgContext = useContext(OrgContext);

  return (
    <Fragment>
      <Typography color="textSecondary" variant="h6" gutterBottom>Org</Typography>
      <Grid container spacing={3}>
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
