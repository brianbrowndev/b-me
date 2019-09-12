import React, { Fragment } from 'react';
import { Typography, makeStyles, Theme, createStyles, Grid } from '@material-ui/core';
import {  DataPoint } from '../common/client';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    label: {
      display:'inline-block',
      fontWeight: theme.typography.fontWeightMedium
    },
    description: {
      display:'inline-block'
    }
  })
});

interface WeatherCurrentProps {
  current: DataPoint;
  day: DataPoint;

}

function WeatherCurrent({current, day}: WeatherCurrentProps) {
  const classes = useStyles();

  return (
    <Fragment>
      <Typography color="textSecondary" gutterBottom>
        {current.summary}
      </Typography>
      <Grid
        container
        direction="row"
        justify="space-around"
        spacing={1}
      >
        <Grid item>
          <Typography className={classes.label} variant="body2">
            Feels Like:&nbsp;
          </Typography>
          <Typography className={classes.description} variant="body2">
            {current.apparentTemperature && current.apparentTemperature.toFixed(0)}&#176;
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.label} variant="body2">
            Low:&nbsp;
          </Typography>
          <Typography className={classes.description} variant="body2">
            {day.apparentTemperatureLow && day.apparentTemperatureLow.toFixed(0)}&#176;
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.label} variant="body2">
            High:&nbsp;
          </Typography>
          <Typography className={classes.description} variant="body2">
            {day.apparentTemperatureHigh && day.apparentTemperatureHigh.toFixed(0)}&#176;
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.label} variant="body2">
            Humidity:&nbsp;
          </Typography>
          <Typography className={classes.description} variant="body2">
            {current.humidity && (current.humidity * 100).toFixed(0)}%
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.label} variant="body2">
            Wind:&nbsp;
          </Typography>
          <Typography className={classes.description} variant="body2">
            {current.windSpeed && current.windSpeed.toFixed(0)} mph
          </Typography>
        </Grid>
      </Grid>
    </Fragment>
 );
}

export default WeatherCurrent;
