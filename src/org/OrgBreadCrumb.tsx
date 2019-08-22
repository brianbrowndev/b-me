import React, { useEffect, useState, useContext, Fragment } from 'react';
import { OrgContext, OrgGroup, OrgItem } from './OrgContext';
import { Typography, Paper, makeStyles, Breadcrumbs, Button } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  paper: {
    padding: theme.spacing(1, 2),
    background: 'inherits'
  },
  link: {
    color:'inherit',
    textDecoration:'none',
  },
}));

interface OrgBreadcrumbProps {
  url:string; 
}

function OrgBreadcrumb(props:OrgBreadcrumbProps) {
  const orgContext = useContext(OrgContext);
  const classes = useStyles();

  const [groupItem, setGroupItem] = useState<OrgGroup>();
  const [item, setItem] = useState<OrgItem>();

  useEffect(
      (() => { 

          const groupItem = orgContext.findOrgGroupItemByPath(props.url);
          if (groupItem !== null) {
              setGroupItem(groupItem);
              const item = groupItem.items[0];
              setItem(item);
          }
      }),
      [props.url, orgContext]
  );


  return (
    <Fragment>
        { groupItem && 
          <Breadcrumbs aria-label="breadcrumb">

                <NavLink exact to='/' className={classes.link}>
                  <Button>Home</Button>
                </NavLink>

                <NavLink exact to={groupItem.path} className={classes.link}>
                  <Button>{groupItem.title}</Button>
                </NavLink>

                { item && 
                  <Typography color="textPrimary">{item.title}</Typography>
                }

          </Breadcrumbs>
        }
    </Fragment>
  )
}

export default OrgBreadcrumb;
