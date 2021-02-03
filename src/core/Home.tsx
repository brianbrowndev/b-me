import React, { Fragment } from "react";
import {
  Grid,
  Typography,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import RecentBooksCard from "../books/RecentBooksCard";
import WeatherCard from "../weather/WeatherCard";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.down("md")]: {
        justifyContent: "center",
      },
    },
    title: {
      marginTop: theme.spacing(4),
    },
  });
});

function Home() {
  const classes = useStyles();
  return (
    <Fragment>
      <Typography
        color="textSecondary"
        variant="h5"
        gutterBottom
        className={classes.title}
      >
        Dashboard
      </Typography>
      <Grid
        spacing={3}
        container
        className={classes.container}
        justify="center"
      >
        <Grid item>
          <WeatherCard />
        </Grid>
        <Grid item>
          <RecentBooksCard />
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default Home;
