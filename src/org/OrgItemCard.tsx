import React, { useEffect, useContext, useState } from 'react';
import {  Card, CardContent, Typography, makeStyles, Theme, createStyles } from '@material-ui/core';
import {  OrgItem, OrgContext, OrgGroup } from '../org/OrgContext';
import AppLink from '../core/components/AppLink';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    card: {
      [theme.breakpoints.up('md')]: {
        width:'300px',
      },
      // minHeight:'200px'
      '&:hover': {
        color: theme.palette.secondary.light
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
