import React  from 'react';
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
      { type === Icon.ClearDay && <span role="img" aria-label="sun">☀</span>}
      { type === Icon.ClearNight && <span role="img" aria-label="night">🌑</span>}
      { type === Icon.Rain && <span role="img" aria-label="rain">🌧</span>}
      { type === Icon.Snow && <span role="img" aria-label="snow">🌨️</span>}
      { type === Icon.Sleet && <span role="img" aria-label="sleet">🌨️</span>}
      { type === Icon.Wind && <span role="img" aria-label="wind">💨</span>}
      { type === Icon.Fog && <span role="img" aria-label="fog">🌫️</span>}
      { type === Icon.Cloudy && <span role="img" aria-label="cloud">☁</span>}
      { type === Icon.PartlyCloudyDay && <span role="img" aria-label="cloudy-day">🌥</span>}
      { type === Icon.PartlyCloudyNight && <span role="img" aria-label="cloudy-night">🌑</span>}
    </div>
  )

}