import React, { Fragment } from 'react';
import { Typography, makeStyles, Theme, createStyles, Grid } from '@material-ui/core';
import {  DataPoint } from '../common/client';
import WeatherIcon from './WeatherIcon';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    label: {
      display:'inline-block',
      fontWeight: theme.typography.fontWeightMedium
    },
    description: {
      display:'inline-block'
    },
    weatherIcon: {
      flex:'1'
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
        {current.apparentTemperature && current.apparentTemperature.toFixed(0)}&#176;&nbsp;{current.summary}
      </Typography>

      <Grid container direction="row" justify="space-around" alignItems="center" spacing={1}>

        <Grid item  className={classes.weatherIcon}>
          <Grid container direction="row"  justify="center">
            <Grid item>
              <WeatherIcon type={current.icon!}/>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="column" alignItems="flex-end" spacing={0}>

           <Grid item>
              <Typography className={classes.label} variant="body2">
                Temp:&nbsp;
              </Typography>
              <Typography className={classes.description} variant="body2">
                {day.apparentTemperatureHigh && day.apparentTemperatureHigh.toFixed(0)}&#176;
              </Typography>
              <Typography className={classes.description} variant="body2" color="textSecondary">
                &nbsp;|&nbsp;
                {day.apparentTemperatureLow && day.apparentTemperatureLow.toFixed(0)}&#176;
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
           
              <Grid item>
                <Typography className={classes.label} variant="body2">
                  Rain:&nbsp;
                </Typography>
                <Typography className={classes.description} variant="body2">
                  {day.precipProbability && day.precipProbability.toFixed(0)}%
                </Typography>
              </Grid>

          </Grid>
        </Grid>
      </Grid>
    </Fragment>
 );
}

export default WeatherCurrent;
