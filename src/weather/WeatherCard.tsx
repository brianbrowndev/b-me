import React, { useState, useEffect, Fragment } from 'react';
import {  Card, CardContent, Typography, makeStyles, Theme, createStyles, CardActions, Button, Divider, List, Collapse  } from '@material-ui/core';
import WeatherApi from '../common/client/WeatherApi';
import AppSpinner from '../core/components/AppSpinner';
import { DarkSkyResponse, BingAddress  } from '../common/client';
import GeocodeApi from '../common/client/GeocodeApi';
import WeatherCurrent from './WeatherCurrent';
import WeatherListDay from './WeatherListDay';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
        width:'300px',
    },
    title: {
      fontSize: 14,
      float:'right'
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
  })
});

const defaultLocation:[number, number] = [37.533333, -77.466667]; // default to Richmond
function WeatherCard() {
  const classes = useStyles();

  const [weather, setWeather] = useState<DarkSkyResponse | null>(null);
  const [location, setLocation] = useState<BingAddress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(
      (() => {

        const getForecast = (latitude: number, longitude:number) => {
          const createDevLocationPromise: () => Promise<BingAddress[]> = () => new Promise<BingAddress[]>((resolve)=>resolve([{"addressLine":"E Grace St","adminDistrict":"VA","adminDistrict2":"Richmond City","countryRegion":"United States","locality":"Chimborazo","neighborhood":"","postalCode":"23223","type":0,"confidence":1,"formattedAddress":"E Grace St, Richmond, VA 23223","coordinates":{"lat":37.5251146,"lng":-77.4128081},"provider":"Bing"}]));
          Promise.all([
            WeatherApi.getForecast(latitude, longitude),
            process.env.NODE_ENV === 'production'? GeocodeApi.reverse(latitude, longitude) : createDevLocationPromise()
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
        { error && 
          <Typography color="error" variant="overline">{error}</Typography>
        }
        { location &&
          <Typography variant="h5" component="h2"> 
            {location.adminDistrict2 }
          </Typography>
        }
       { isLoading ?  (<AppSpinner /> ) 
        : (
          <Fragment>
            { (weather && weather.response && weather.response.currently && weather.response.daily && weather.response.daily.data) 
              && <WeatherCurrent current={weather.response.currently} day={weather.response.daily.data[0]} />
            }
         </Fragment>
        ) }
      </CardContent>
      <Divider/>
      <CardActions>
        <Button size="small" color="secondary"
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          {expanded ? 'Hide Forecast' : 'View Forecast'}
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        { (weather && weather.response && weather.response.daily && weather.response.daily.data)
          &&
          <Fragment>
            <List component="ul" dense>
              {weather.response.daily.data.map((day,idx) => <WeatherListDay key={idx} day={day}/>)}
            </List>
          </Fragment>
        }
      </Collapse>
    </Card>
  );
}

export default WeatherCard;
