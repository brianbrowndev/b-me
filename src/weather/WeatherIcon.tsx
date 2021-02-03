import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core";
import { Icon } from "../common/client";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    icon: {
      fontFamily:
        "apple color emoji,segoe ui emoji,noto color emoji,android emoji,emojisymbols,emojione mozilla,twemoji mozilla,segoe ui symbol",
      fontStyle: "normal",
      fontWeight: theme.typography.fontWeightRegular,
    },
    small: {
      fontSize: theme.typography.h6.fontSize,
      lineHeight: "5px",
      height: "10px",
    },
    large: {
      fontSize: theme.typography.h2.fontSize,
      lineHeight: "20px",
      height: "30px",
    },
  });
});
interface WeatherIconProps {
  type: Icon;
  size: "small" | "large";
}

const getWeatherIcon = (type: Icon): string => {
  switch (type) {
    case Icon.ClearDay:
    case Icon.None:
      return "\u2600\ufe0f";
    case Icon.ClearNight:
      return "\ud83c\udf11";
    case Icon.Cloudy:
    case Icon.PartlyCloudyNight:
      return "\u2601\ufe0f";
    case Icon.PartlyCloudyDay:
      return "\u26c5";
    case Icon.Rain:
      return "\ud83c\udf27\ufe0f";
    case Icon.Snow:
    case Icon.Sleet:
      return "\ud83c\udf28\ufe0f";
    case Icon.Fog:
      return "\ud83c\udf2b\ufe0f";
    case Icon.Wind:
      return "\ud83d\udca8";
    default:
      return "\u2600\ufe0f";
  }
};

// I know, this is as cheap as a solution as you can get - emojis.
export default function WeatherIcon({ type, size }: WeatherIconProps) {
  const classes = useStyles();
  return (
    <div
      className={clsx(
        classes.icon,
        size === "large" ? classes.large : classes.small
      )}
    >
      <span role="img" aria-label="weather">
        {getWeatherIcon(type)}
      </span>
    </div>
  );
}
