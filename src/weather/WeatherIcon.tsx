import React, { Fragment } from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core';
import { Icon } from '../common/client';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    icon: {
      fontFamily: 'Apple Color Emoji,Segoe UI,Segoe UI Emoji,Segoe UI Symbol',
      fontSize: theme.typography.h2.fontSize,
      fontStyle: 'normal',
      fontWeight: theme.typography.fontWeightRegular,
      lineHeight: '20px',
      height: '30px'
    }
  })
});
interface WeatherIconProps {
  type: Icon;
}

// I know, this is as cheap as a solution as you can get - emojis.
export default function WeatherIcon({type}:WeatherIconProps) {
  const classes = useStyles();
  return (
    <div className={classes.icon}>
      { type == Icon.ClearDay && <Fragment>☀</Fragment>}
      { type == Icon.ClearNight && <Fragment>🌑</Fragment>}
      { type == Icon.Rain && <Fragment>🌧</Fragment>}
      { type == Icon.Snow && <Fragment>🌨️</Fragment>}
      { type == Icon.Sleet && <Fragment>🌨️</Fragment>}
      { type == Icon.Wind && <Fragment>💨</Fragment>}
      { type == Icon.Fog && <Fragment>🌫️</Fragment>}
      { type == Icon.Cloudy && <Fragment>☁</Fragment>}
      { type == Icon.PartlyCloudyDay && <Fragment>🌥</Fragment>}
      { type == Icon.PartlyCloudyNight && <Fragment>🌑</Fragment>}
    </div>
  )

}