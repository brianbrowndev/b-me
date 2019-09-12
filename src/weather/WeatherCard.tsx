import React, { useState, useEffect, Fragment } from 'react';
import {  Card, CardContent, Typography, makeStyles, Theme, createStyles, CardActions, Button, Divider, Grid } from '@material-ui/core';
import WeatherApi from '../common/client/WeatherApi';
import AppSpinner from '../core/components/AppSpinner';
import { DarkSkyResponse, BingAddress } from '../common/client';
import GeocodeApi from '../common/client/GeocodeApi';
import WeatherCurrent from './WeatherCurrent';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
        width:'300px',
    },
    title: {
      fontSize: 14,
      float:'right'
    }
  })
});

const defaultLocation:[number, number] = [37.533333, -77.466667];
function WeatherCard() {
  const classes = useStyles();

  const [weather, setWeather] = useState<DarkSkyResponse | null>(null);
  const [location, setLocation] = useState<BingAddress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(
      (() => {

        const getForecast = (latitude: number, longitude:number) => {
          Promise.all([
            WeatherApi.getForecast(latitude, longitude),
            GeocodeApi.reverse(latitude, longitude)
          ]).then(([weather, addresses]) => {
              setWeather(weather);
              setLocation(addresses[0]);
              setIsLoading(false);
          }).catch(err => {
              setError(`Error getting weather: ${err.message}`)
              setIsLoading(false);
          });
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => getForecast(position.coords.latitude, position.coords.longitude), 
            err => getForecast(...defaultLocation)
          );
        }
        else {
          // default to Richmond
          getForecast(...defaultLocation);
        }
      }), 
      [] 
  );

  return (
    <Card className={classes.card}>
      <CardContent>
        { location &&
        <Typography className={classes.title} color="textSecondary">
          {location.adminDistrict2 }
        </Typography>
        }
        <Typography variant="h5" component="h2"> 
          Weather
        </Typography>
       { isLoading ?  (<AppSpinner /> ) 
        : (
          <Fragment>
           { (weather && weather.response && weather.response.currently && weather.response.daily && weather.response.daily.data) 
           && <WeatherCurrent current={weather.response.currently} day={weather.response.daily.data[0]} />
           }

          </Fragment>
        ) }
      </CardContent>
      <Divider />
      <CardActions>
        <Button size="small" color="secondary">
          Expand
        </Button>
      </CardActions>
    </Card>
  );
}

export default WeatherCard;
