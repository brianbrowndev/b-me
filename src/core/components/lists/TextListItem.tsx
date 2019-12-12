import React from 'react';
import { ListItem, ListItemText } from '@material-ui/core';

export default function ({button=false, content, side, ...props}:{button: boolean, content:JSX.Element, side:JSX.Element} & any) {
  return (
    <ListItem button={button} {...props}>
      <ListItemText primary={
        <React.Fragment>
          {content}
        </React.Fragment>
      }>
      </ListItemText>
      {side}
    </ListItem>
  )
}