import React, { Fragment, useEffect } from 'react';
import { List, ListItem, ListItemText, createStyles, makeStyles, Theme, Collapse } from '@material-ui/core';
import { OrgGroup  } from './OrgContext';
import ListItemLink from '../core/components/ListItemLink';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import * as H from 'history';

const useStyles = makeStyles((theme: Theme) =>
  {
    return createStyles({
      listTitle: {
        fontWeight:theme.typography.fontWeightBold,
      },
    })
  },
);



export interface OrgGroupRouteListProps {
  nested?: boolean;
  orgGroup: OrgGroup;
  onClick?():void;
  history: H.History
}

function OrgGroupRouteList(props:OrgGroupRouteListProps) {
  const { orgGroup, nested, onClick, history } = props;
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

  /* Expand/collapse based on route changes */
  useEffect(() => {
    const hasPathName = (pathName:string | undefined): boolean => {
      return orgGroup.items.find(item => item.path === pathName) ? true : false;

    }
    if (hasPathName(history.location.pathname)) {
      setOpen(true);
    }
    else {
      setOpen(false);
    }
  }, [history.location.pathname, orgGroup.items]);

  return (
    <List disablePadding component="div">
      <ListItem button onClick={handleClick}>
        <ListItemText primary={orgGroup.title} classes={{primary: classes.listTitle}}/>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>       
      <Collapse in={open} timeout="auto" unmountOnExit>
        {orgGroup.items.map(item => 
          <Fragment key={item.title}>
            <ListItemLink path={item.path} name={item.title} onClick={onClick} nested={nested}/>
          </Fragment>
        )}
      </Collapse>
    </List>
  )
}


export default OrgGroupRouteList;
