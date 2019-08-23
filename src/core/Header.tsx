import React, { useContext, useState, Fragment } from 'react';


import {AuthContext } from './Auth'

import {
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography, Divider,  createStyles, makeStyles, IconButton, Theme, Drawer, ListItem, List, ListItemText, ListItemIcon, useScrollTrigger, Hidden, useTheme } from '@material-ui/core';
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
        flexGrow: 1,
        marginBottom:'5px'
      },
      logo: {
        color:theme.palette.text.primary,
        fontWeight:700,
        opacity: 0.8,
        fontFamily: 'Libre Franklin'

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
        backgroundColor: theme.palette.primary.light
      },
      toolbar: theme.mixins.toolbar,
      drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.primary.light,
      },
      menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
          display: 'none',
        },
      },

      login: {
        position:'relative',
        bottom:0,
      },
      contentList: {
        flex:1,
      },
      listTitle: {
        fontWeight:theme.typography.fontWeightBold,
      },
      listIcon: {
        color:'inherit'
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
  const theme = useTheme();

  const logout = () => authContext.logout(() => history.push("/"));

  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => setOpen(!open);
  const handleDrawerClose = () => setOpen(false);


  const drawer = (
    <Fragment>
      <Toolbar />
      <List
        component="div"
        className={classes.contentList}>
        <AppLink to="/" exact={true} onClick={handleDrawerClose}>
          <ListItem button>
              <ListItemText primary="Home" classes={{primary: classes.listTitle}}/>
          </ListItem>
        </AppLink>
        {orgContext.routes().map(groupItem => 
          <Fragment key={groupItem.title}>
            <ListItem>
              <ListItemText primary={groupItem.title} classes={{primary: classes.listTitle}}/>
            </ListItem>       
            <OrgGroupRouteList orgGroup={groupItem} onClick={handleDrawerClose} key={groupItem.title} nested={true}></OrgGroupRouteList>
          </Fragment>
        )}
      </List>
    </Fragment>
  );

  return (
    <Fragment>
      <ElevationScroll>
        <AppBar color="primary" elevation={1} className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" className={classes.title} >
              <AppLink to="/">
                <span className={classes.logo}>me</span>
              </AppLink>
            </Typography>
            { authContext.authenticated ?
            (
                <IconButton
                  onClick={logout}
                  color="inherit"
                  aria-label="logout"
                  edge="start">
                  <ExitToAppIcon />
                </IconButton> 
            ) : (
              <AppLink to="/login">
                <IconButton
                  color="inherit"
                  aria-label="login"
                >
                  <AccountCircleIcon />
                </IconButton>
              </AppLink>
            )}
         </Toolbar>

        </AppBar>
      </ElevationScroll>
      <nav className={classes.drawer}>
          <Hidden smUp>
            <Drawer
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={open}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown>
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>


      </nav>
    </Fragment>
  );
}


export default withRouter(Header);
