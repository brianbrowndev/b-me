import React, { useContext, useState, Fragment } from 'react';


import {AuthContext } from './Auth'

import {
  NavLink,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography, Divider,  createStyles, makeStyles, IconButton, Theme, Drawer, ListItem, List, ListItemText, ListSubheader, ListItemIcon, useScrollTrigger } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { OrgContext  } from '../org/OrgContext';
import OrgGroupRouteList from '../org/OrgGroupRouteList';
import AppLink from './components/AppLink';


const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  {
    return createStyles({
      title: {
        flexGrow: 1
      },
      appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
          width: `calc(100% - ${drawerWidth}px)`,
        },
      },
      drawer: {
        [theme.breakpoints.up('sm')]: {
          width: drawerWidth,
          flexShrink: 0,
        },
      },
      toolbar: theme.mixins.toolbar,
      drawerPaper: {
        width: drawerWidth,
        overflow:'hidden'
      },
      logo: {
        color:'initial'
      },
      login: {
        position:'relative',
        bottom:0,
      },
      contentList: {
        flex:1,
        overflowY:'auto'
      }
    })
  },
);

function ElevationScroll(props: any) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

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
    <Fragment>
      <Toolbar />
      <List
        component="div"
        className={classes.contentList}>
{/* 
      //   subheader={
      //     <ListSubheader>
      //       Org
      //     </ListSubheader>
      // }>
 */}
        {orgContext.routes().map(groupItem => 
          <Fragment>
            <ListItem>
              <ListItemText primary={groupItem.title} />
            </ListItem>       
            <OrgGroupRouteList orgGroup={groupItem} onClick={handleDrawerClose} key={groupItem.title} nested={true}></OrgGroupRouteList>
            {/* <Divider /> */}
          </Fragment>
        )}
      </List>
      <List component="div" className={classes.login}>
          <Divider />
          { authContext.authenticated ?
          (
            <ListItem button  onClick={logout}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>

          ) : (
            <AppLink to="/login" onClick={handleDrawerClose}>
              <ListItem button>
                  <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                  <ListItemText primary="Login" />
              </ListItem>
            </AppLink>
          )}
      </List>
    </Fragment>
  );

  return (
    <Fragment>
      <ElevationScroll>
        <AppBar color="primary" elevation={1} className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title} >
              <AppLink to="/">
                <span className={classes.logo}>Me</span>
              </AppLink>
            </Typography>
            <IconButton color="inherit" onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          </Toolbar>

        </AppBar>
      </ElevationScroll>
      <nav className={classes.drawer}>

          {/* <Drawer
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
          </Drawer> */}
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>

      </nav>
    </Fragment>
  );
}


export default withRouter(Header);
