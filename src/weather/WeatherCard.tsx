import React, { useState, useEffect, Fragment } from 'react';
import {  Card, CardContent, Typography, makeStyles, Theme, createStyles, List, ListItemText, ListItem, ListItemIcon, CardActions, Button, Divider } from '@material-ui/core';
import AppLink from '../core/components/AppLink';
import WeatherApi from '../common/client/WeatherApi';
import AppSpinner from '../core/components/AppSpinner';
import { DarkSkyResponse } from '../common/client';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
        width:'300px',
    }
  })
});

function WeatherCard() {
  const classes = useStyles();

  const [weather, setWeather] = useState<DarkSkyResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(
      (() => {

        const getForecast = (latitude: number, longitude:number) => {
            WeatherApi.getForecast(latitude, longitude).then(weather => {
              setWeather(weather);
              setIsLoading(false);
          }).catch(err => {
              setError(`Error getting weather: ${err.message}`)
              setIsLoading(false);
          });
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            getForecast(position.coords.latitude, position.coords.longitude);
          });
        }
        else {
          // default to Richmond
          getForecast(37.533333, -77.466667);
        }
      }), 
      [] 
  );

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom> 
          Weather
        </Typography>
        { isLoading ?  (<AppSpinner /> ) 
        : (
          <List disablePadding component="div" dense>
              { error && 
                <Typography color="error" variant="overline">{error}</Typography>
              }
              { weather && 
                <Fragment>
                  <Typography variant="h6">
                    {weather.response!.currently!.temperature!.toFixed(0)}&#176;
                  </Typography>
                  <List>
                    {weather.response!.daily!.data!.map(dataPoint => 
                      <ListItem key={dataPoint.time}>
                        <Divider />
                        {/* <ListItemText
                        <Typography variant="h6">
                          {dataPoint!.temperatureHigh!.toFixed(0)}&#176; | {dataPoint!.temperatureLow!.toFixed(0)}&#176;
                        </Typography> */}
                      </ListItem>
                    )}
                  </List>
                </Fragment>
              }
             {/* {books.map(book => 
                <ListItem key={book.id}>
                  { (book.bookStatus && book.bookStatus.keyword === 'STARTED') && 
                  <ListItemIcon>
                    <BookIcon color="secondary" />
                  </ListItemIcon>
                  }
                  <ListItemText primary={book.name} secondary={book.bookAuthor ? book.bookAuthor.name : null}/>
                </ListItem> */}
              {/* )} */}
          </List>
        ) }
      </CardContent>
      <CardActions>
        {/* <AppLink to="/books" exact={true}>
          <Button size="small" color="secondary">
            View More
          </Button>
        </AppLink> */}
      </CardActions>
    </Card>
  );
}

export default WeatherCard;
