import React from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, Toolbar, Typography } from '@material-ui/core';
import { FormSchema } from '../forms/SchemaForm';
import CoreTableFilter from './CoreTableFilter';

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
    },
  }),
);

interface CoreTableToolbarProps {
  title: string;
  filterSchema?: FormSchema;
}

export default function CoreTableToolbar ({ title, filterSchema }: CoreTableToolbarProps) {
  const classes = useToolbarStyles();
  return (
    <Toolbar
      className={classes.root}
    >
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
          {title}
        </Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        { filterSchema && 
          <CoreTableFilter schema={filterSchema} />
        }
      </div>
    </Toolbar>
  );
};