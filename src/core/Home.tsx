import React, { useContext, Fragment } from 'react';
import { Grid, Typography, createStyles, makeStyles, Theme, Paper, } from '@material-ui/core';
import { BlogContext } from '../blog/BlogContext';
import RecentBooksCard from '../books/RecentBooksCard';
import WeatherCard from '../weather/WeatherCard';
import AppLink from './components/AppLink';
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        justifyContent: 'center'
      }
    },
    title: {
      marginTop: theme.spacing(4)
    },
    posts: {
      width: '100%',
      padding: theme.spacing(4)
    },
    postsHeader: {
      marginBottom: theme.spacing(1)
    },
    postDate: {
      width: '125px',
      display: 'inline-block'
    },
    post: {
      display: 'flex',
      alignItems: 'center'
    }
  })
});



function Home() {
  const blogContext = useContext(BlogContext);
  const classes = useStyles();

  return (
    <Fragment>
      <Typography color="textSecondary" variant="h5" gutterBottom className={classes.title}>
        Dashboard
      </Typography>
      <Grid spacing={3} container className={classes.container} justify="center">
        <Grid item>
          <WeatherCard />
        </Grid>
        <Grid item>
          <RecentBooksCard />
        </Grid>
      </Grid>
      <Typography color="textSecondary" variant="h5" gutterBottom className={classes.title}>
        Content
      </Typography>
      <Paper elevation={2} className={classes.posts}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={6} lg={4}>
            <Typography variant="h6" className={classes.postsHeader}>Most recent 5 posts</Typography>
            {blogContext.routes().sort((a, b) => a.date! < b.date! ? 1 : a.date! > b.date! ? -1 : 0).slice(0, 5).map(item =>
              <AppLink to={blogContext.formatPostUrl(item.path!)} key={item.id}>
                <div className={classes.post}>
                  <Typography variant="body2" className={classes.postDate} >{moment(item.date).format("MMM Do YYYY")}</Typography>
                  <Typography variant="body1">{item.title}</Typography>
                </div>
              </AppLink>
            )}
          </Grid>
          {blogContext.groups().map(group =>
            <Grid item key={group.id} sm={12} md={6} lg={4}>
              <Typography variant="h6" className={classes.postsHeader}>{group}</Typography>
              {blogContext.findRoutesByGroup(group).sort((a, b) => a.date! < b.date! ? 1 : a.date! > b.date! ? -1 : 0).map(item =>
                <AppLink to={blogContext.formatPostUrl(item.path!)} key={item.id}>
                  <div className={classes.post}>
                    <Typography variant="body2" className={classes.postDate}>
                      {moment(item.date).format("MMM YYYY")}
                    </Typography>
                    <Typography variant="body1">{item.title}</Typography>
                  </div>
                </AppLink>
              )}
            </Grid>
          )}
        </Grid>
      </Paper>
    </Fragment>
  );
}

export default Home;
