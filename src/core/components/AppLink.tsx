import React  from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  {
    return createStyles({
      link: {
        color:'inherit',
        textDecoration:'none',
      },
      linkActive: {
        color:theme.palette.secondary.main,
        fontWeight:700
      }
    });
  },
);

const AppLink = (props:NavLinkProps) => {
  const classes = useStyles();
  return <NavLink {...props} activeClassName={classes.linkActive} className={classes.link} />

}
export default AppLink;