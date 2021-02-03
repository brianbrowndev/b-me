import React from "react";
import {
  Grid,
  CircularProgress,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    progress: {
      margin: theme.spacing(2),
    },
  });
});

export default function AppSpinner() {
  const classes = useStyles();
  return (
    <Grid container justify="center" alignItems="center">
      <CircularProgress className={classes.progress} color="secondary" />
    </Grid>
  );
}
