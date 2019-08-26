import React from 'react';
import {  Card, CardContent, Typography, makeStyles, CardActions, Collapse, IconButton } from '@material-ui/core';
import {  OrgGroup } from '../org/OrgContext';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OrgGroupRouteList from './OrgGroupRouteList';
import * as H from 'history';

const useStyles = makeStyles({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

interface OrgGroupCardProps {
  orgGroup: OrgGroup;
  history: H.History;
}

function OrgGroupCard(props: OrgGroupCardProps) {
  const { orgGroup, history } = props;
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);
  function handleExpandClick() {
    setExpanded(!expanded);
  }

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Org
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom> 
          {orgGroup.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {orgGroup.description}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <OrgGroupRouteList orgGroup={orgGroup} history={history}></OrgGroupRouteList>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default OrgGroupCard;
