import React, { useContext } from 'react';
import { Container, Card, CardContent, Typography, makeStyles, CardActions, Button, Grid } from '@material-ui/core';
import { OrgContext } from '../org/OrgContext';
import { NavLink } from 'react-router-dom';

 const useStyles = makeStyles({
  card: {
    width: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  link: {
    color:'inherit',
    textDecoration:'none',
  },
});

function Home() {
  const classes = useStyles();
  const orgContext = useContext(OrgContext);
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom> 
                Org
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                All information relating to places, people, and things.
              </Typography>
            </CardContent>
            <CardActions>
            {orgContext.routes().map(groupItem => 
              <NavLink exact to={groupItem.path} key={groupItem.title} className={classes.link}>
                <Button>{groupItem.title}</Button>
              </NavLink>
            )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
