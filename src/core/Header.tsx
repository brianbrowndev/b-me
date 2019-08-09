import React, { Fragment, useContext, useState } from 'react';


import {AuthContext } from './Auth'

import {
  Link,
  NavLink,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import './Header.scss';
import { Typography, Divider,  Button, createStyles, makeStyles, IconButton, Theme, Drawer, ListItem, List, ListItemText, ListSubheader } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  {
    return createStyles({
      title: {
        flexGrow: 1
      },
      root: {
        display: 'flex',
      },
      drawer: {
        [theme.breakpoints.up('sm')]: {
          width: drawerWidth,
          flexShrink: 0,
        },
      },
      appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
          width: `calc(100% - ${drawerWidth}px)`,
        },
      },
      menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
          display: 'none',
        },
      },
      toolbar: theme.mixins.toolbar,
      drawerPaper: {
        width: drawerWidth,
      },
      content: {
        flexGrow: 1,
        padding: theme.spacing(3),
      },
      listNested: {
        paddingLeft: theme.spacing(4)
      },
      link: {
        color:'none',
        textDecoration:'none'
      }
    });
  },
);

function ListItemLink(props:{path:string, name:string}) {
  const classes = useStyles();
  return  (
    <NavLink exact to={props.path}>
      <ListItem className={classes.listNested} button>
        <ListItemText primary={props.name} />
      </ListItem>
    </NavLink>
  )

}


function Header({ history }: RouteComponentProps) {

    const authContext = useContext(AuthContext);

    const classes = useStyles();

    const logout = () => {
        // setAnchorEl(null);
        authContext.logout(() => history.push("/"));
    }

    const [open, setOpen] = useState(false);

    function handleDrawerToggle() {
        setOpen(!open);
    }


  function handleDrawerOpen() {
    setOpen(true);
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List
        component="div"
        subheader={
          <ListSubheader>
            Org
          </ListSubheader>
      }>
        <ListItem>
          <ListItemText primary="Places" />
        </ListItem>       
        <List disablePadding component="div">
          <ListItemLink path="/org/life/places/raleigh" name="Raleigh" />
          <ListItemLink path="/org/life/places/santa-barbara" name="Santa Barbara" />
        </List>
        { authContext.authenticated && 
          <Fragment>
            <ListItem>
              <ListItemText primary="Life" />
            </ListItem>       
            <List disablePadding component="div">
              <ListItemLink path="/org/life/birthdays" name="Birthdays" />
              <ListItemLink path="/org/life/homes" name="Homes" />
            </List>
          </Fragment> 
        }
        <Divider />
        <List component="div">
          <ListItem>
            { authContext.authenticated ?
            (
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button color="inherit">login
                </Button>
              </Link>
            )}
          </ListItem>
        </List>
     </List>
    </div>
  );

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" className={classes.title} >
          Me
        </Typography>
        <IconButton color="inherit" onClick={handleDrawerOpen}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{keepMounted: true }} // Better open performance on mobile.
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}


export default withRouter(Header);
