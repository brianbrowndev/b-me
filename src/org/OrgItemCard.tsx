import React, { useEffect, useContext, useState } from 'react';
import {  Card, CardContent, Typography, makeStyles, Theme, createStyles } from '@material-ui/core';
import {  OrgItem, OrgContext, OrgGroup } from '../org/OrgContext';
import AppLink from '../core/components/AppLink';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
      [theme.breakpoints.up('md')]: {
        width:'300px',
      },
      '&:hover': {
        color: theme.palette.secondary.light,
        boxShadow: '0px 4px 6px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)'
      },
    },
    description: {
      min:'60px'
    }
  })
});

interface OrgItemCardProps {
  orgItem: OrgItem;
}

function OrgItemCard(props: OrgItemCardProps) {
  const { orgItem } = props;
  const classes = useStyles();

  const orgContext = useContext(OrgContext);
  const [group, setGroup] = useState<OrgGroup>();

  useEffect(
      (() => { 

          const group = orgContext.findOrgItemParentByPath(orgItem.path);
          if (group !== null) {
              setGroup(group);
          }
      }),
      [orgItem, orgContext]
  );


  return (
    <AppLink to={orgItem.path}>
      <Card className={classes.card}>
        <CardContent>
          { group &&
            <Typography color="textSecondary" gutterBottom>
              {group.title}
            </Typography>
          }
          <Typography variant="h5" component="h2" gutterBottom> 
            {orgItem.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" className={classes.description}>
            {orgItem.description}
          </Typography>
        </CardContent>
      </Card>
    </AppLink>
  );
}

export default OrgItemCard;
