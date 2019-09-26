import React, { Fragment, useState } from 'react';
import { Typography, makeStyles, Theme, createStyles, Grid, ListItem, ListItemText, ListItemAvatar, Collapse, List } from '@material-ui/core';
import {  DataPoint } from '../common/client';
import WeatherIcon from './WeatherIcon';
import moment, { CalendarSpec } from 'moment';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

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

interface WeatherListDayProps {
  day: DataPoint;

}

const dayFormat = {
    sameDay: '[Today]',
    nextDay: 'dddd',
    nextWeek: 'dddd',
    lastDay: 'dddd',
    lastWeek: 'dddd',
    sameElse: 'dddd'
} as CalendarSpec;

function WeatherListDay({day}: WeatherListDayProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };


  return (
    <Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemAvatar>
          <WeatherIcon type={day.icon!} size="small"/>
        </ListItemAvatar>
        <ListItemText primary={
          <React.Fragment>
            <Typography variant="subtitle2" color="textPrimary">
              <Grid container direction="row" justify="space-between" spacing={0}>
                <Grid item>
                  {moment(day.dateTime!).calendar(undefined, dayFormat)}
                </Grid>
                <Grid item>
                  {day.apparentTemperatureHigh && day.apparentTemperatureHigh.toFixed(0)}&#176; | {day.apparentTemperatureLow && day.apparentTemperatureLow.toFixed(0)}&#176;
                </Grid>
              </Grid>
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
             {day.summary}
            </Typography>
          </React.Fragment>
        }>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          <ListItem>
            <Grid container direction="row" justify="space-around" spacing={2}>
              <Grid item>
                <Typography className={classes.label} variant="body2">
                  Humidity:&nbsp;
                </Typography>
                <Typography className={classes.description} variant="body2">
                  {day.humidity && (day.humidity * 100).toFixed(0)}%
                </Typography>
              </Grid>

              <Grid item>
                <Typography className={classes.label} variant="body2">
                  Wind:&nbsp;
                </Typography>
                <Typography className={classes.description} variant="body2">
                  {day.windSpeed && day.windSpeed.toFixed(0)} mph
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.label} variant="body2">
                  Rain:&nbsp;
                </Typography>
                <Typography className={classes.description} variant="body2">
                  {day.precipProbability && (day.precipProbability * 100).toFixed(0)}%
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Collapse>
    </Fragment>
 );
}

export default WeatherListDay;
