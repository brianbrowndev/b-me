import React, { useContext, useState, Fragment } from 'react';


import {AuthContext } from './Auth'

import {
  NavLink,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography, Divider,  createStyles, makeStyles, IconButton, Theme, Drawer, ListItem, List, ListItemText, ListSubheader, ListItemIcon } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { OrgContext  } from '../org/OrgContext';
import OrgGroupRouteList from '../org/OrgGroupRouteList';

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  {
    return createStyles({
      title: {
        flexGrow: 1
      },
      toolbar: theme.mixins.toolbar,
      drawerPaper: {
        width: drawerWidth,
      },
      link: {
        color:'inherit',
        textDecoration:'none',
      },
      linkActive: {
        color:'#1976d2',
        fontWeight: 500,
      }
    });
  },
);
function Header({ history }: RouteComponentProps) {

  const authContext = useContext(AuthContext);
  const orgContext = useContext(OrgContext);

  const classes = useStyles();

  const logout = () => authContext.logout(() => history.push("/"));

  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => setOpen(!open);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);


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
        {orgContext.routes().map(groupItem => 
          <Fragment>
            <ListItem>
              <ListItemText primary={groupItem.title} />
            </ListItem>       
            <OrgGroupRouteList orgGroup={groupItem} onClick={handleDrawerClose} key={groupItem.title} nested={true}></OrgGroupRouteList>
          </Fragment>
        )}
        <Divider />
        <List component="div">
            { authContext.authenticated ?
            (
              <ListItem button  onClick={logout}>
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>

            ) : (
              <NavLink to="/login" onClick={handleDrawerClose} activeClassName={classes.linkActive} className={classes.link}>
                <ListItem button>
                    <ListItemIcon className={classes.link}><AccountCircleIcon /></ListItemIcon>
                    <ListItemText primary="Login" />
                </ListItem>
              </NavLink>
            )}
        </List>
     </List>
    </div>
  );

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" className={classes.title} >
          <NavLink to="/" className={classes.link}>
            Me
          </NavLink>
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
