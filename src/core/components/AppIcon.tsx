import React from 'react';
import Icon, { IconProps } from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'

  },
});

export default function AppIcon(props:IconProps) {
  const classes = useStyles();
  return <Icon  className={classes.root} {...props}/>;
}