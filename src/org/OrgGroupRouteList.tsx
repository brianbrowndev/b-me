import React, { Fragment } from 'react';
import { List, ListItem, ListItemText, createStyles, makeStyles, Theme, Collapse } from '@material-ui/core';
import { OrgGroup  } from './OrgContext';
import ListItemLink from '../core/components/ListItemLink';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

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
}

function OrgGroupRouteList(props:OrgGroupRouteListProps) {
  const { orgGroup, nested, onClick } = props;
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

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
