import React, { useContext } from 'react';
import { Container, Grid, } from '@material-ui/core';
import { OrgContext } from '../org/OrgContext';
import OrgGroupCard from '../org/OrgGroupCard';

function Home() {
  const orgContext = useContext(OrgContext);

  return (
    <Container>
      <Grid container spacing={3}>
        {orgContext.routes().map(groupItem => 
          <Grid item xs={12} sm>
            <OrgGroupCard orgGroup={groupItem} key={groupItem.title}></OrgGroupCard>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Home;
