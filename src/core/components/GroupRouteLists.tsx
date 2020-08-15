import React, { Fragment, useEffect, useContext } from 'react';
import { List, ListItem, ListItemText, createStyles, makeStyles, Theme, Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import * as H from 'history';
import ListItemLink from './ListItemLink';
import { BlogContext } from '../../blog/BlogContext';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    listTitle: {
      fontWeight: theme.typography.fontWeightBold,
    },
  })
},
);


export type RouteItem = {
  path: string;
  title: string;
};

export interface GroupRouteListProps {
  title: string;
  items: RouteItem[];
  onClick?(): void;
  history: H.History;
  nested?: boolean;
}

function GroupRouteList({ title, items, onClick, history, nested }: GroupRouteListProps) {

  const classes = useStyles();

  const blogContext = useContext(BlogContext);

  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

  /* Expand/collapse based on route changes */
  useEffect(() => {
    const hasPathName = (pathName: string | undefined): boolean => {
      return items.find(item => item.path === pathName) ? true : false;
    }
    if (hasPathName(history.location.pathname)) {
      setOpen(true);
    }
    else {
      setOpen(false);
    }
  }, [blogContext, history.location.pathname, items]);

  return (
    <List disablePadding component="div">
      <ListItem button onClick={handleClick}>
        <ListItemText primary={title} classes={{ primary: classes.listTitle }} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {items.map(item =>
          <Fragment key={item.path}>
            <ListItemLink path={item.path} name={item.title} onClick={onClick} nested={nested} />
          </Fragment>
        )}
      </Collapse>
    </List>
  )
}


export default GroupRouteList;

