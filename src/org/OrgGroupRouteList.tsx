import React, { Fragment } from 'react';
import { List } from '@material-ui/core';
import { OrgGroup  } from './OrgContext';
import ListItemLink from '../core/components/ListItemLink';

export interface OrgGroupRouteListProps {
  nested?: boolean;
  orgGroup: OrgGroup;
  onClick?():void;
}

function OrgGroupRouteList(props:OrgGroupRouteListProps) {
  const { orgGroup, nested, onClick } = props;
  return (
    <List disablePadding component="div">
      {orgGroup.items.map(item => 
        <Fragment key={item.title}>
          <ListItemLink path={item.path} name={item.title} onClick={onClick} nested={nested}/>
        </Fragment>
      )}
    </List>
  )
}


export default OrgGroupRouteList;
