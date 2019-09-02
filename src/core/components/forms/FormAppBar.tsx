import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import {  AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    }
  }),
);


interface FormAppBarProps {
  title: string;
  onCancel():void;
  isSaving: boolean;
}


export default function FormAppBar({ title, onCancel, isSaving }: FormAppBarProps) {
  const classes = useStyles();
  
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <IconButton type="button" edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={onCancel}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        <Button type="submit" color="inherit" disabled={isSaving}>Save</Button>
      </Toolbar>
    </AppBar>
  );
}