import React, { useContext, useState, Fragment, useEffect } from 'react';
import { AuthContext } from './Auth'

import {
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography, createStyles, makeStyles, IconButton, Theme, Drawer, ListItem, List, ListItemText, useScrollTrigger, Hidden, useTheme } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { BlogContext } from '../blog/BlogContext';
import AppLink from './components/AppLink';
import GroupRouteList, { RouteItem } from './components/GroupRouteLists';
import ThemeToggleButton from './components/ThemeToggleButton';
import { PostGroup } from '../common/client';


const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    title: {
      flexGrow: 1,
    },
    logo: {
      color: theme.palette.text.primary,
      fontWeight: 300,
      fontFamily: 'Montserrat',
    },
    appBar: {
      marginLeft: drawerWidth,
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
      borderBottom: `1px solid ${theme.palette.type === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'}`
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
      position: 'relative',
      bottom: 0,
    },
    contentList: {
      flex: 1,
    },
    listTitle: {
      fontWeight: theme.typography.fontWeightBold,
    },
    listIcon: {
      color: 'inherit'
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
  const blogContext = useContext(BlogContext);

  const classes = useStyles();
  const theme = useTheme();

  const logout = () => authContext.logout(() => history.push("/"));

  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => setOpen(!open);
  const handleDrawerClose = () => setOpen(false);

  const [groups, setGroups] = useState<PostGroup[]>([])

  useEffect(() => {
    setGroups(blogContext.groups());
  }, [blogContext]);

  const drawer = (
    <Fragment>
      <Toolbar />
      <List
        component="div"
        className={classes.contentList}>
        <AppLink to="/" exact={true} onClick={handleDrawerClose}>
          <ListItem button>
            <ListItemText primary="Home" classes={{ primary: classes.listTitle }} />
          </ListItem>
        </AppLink>
        {groups.map(group =>
          <GroupRouteList title={group.name!} items={blogContext.findRoutesByGroup(group).map(r => r as RouteItem).sort((a, b) => a.title! > b.title! ? 1 : a.title! < b.title! ? -1 : 0)} onClick={handleDrawerClose} key={group.id} history={history} nested={true} />
        )}
        {authContext.authenticated &&
          <GroupRouteList
            title="Admin"
            onClick={handleDrawerClose}
            history={history}
            items={[{ path: "/admin/content", title: "Content" }]}
            nested={true}
          />
        }
        {authContext.authenticated &&
          <GroupRouteList
            title="Finance"
            onClick={handleDrawerClose}
            history={history}
            items={[{ path: "/finance/dashboard", title: "Dashboard" }, { path: "/finance/transactions", title: "Transactions" }, { path: "/finance/expenses", title: "Expenses" }]}
            nested={true}
          />
        }
        {!authContext.authenticated &&
          <AppLink to="/reading/books" exact={true} onClick={handleDrawerClose}>
            <ListItem button>
              <ListItemText primary="Reading List" classes={{ primary: classes.listTitle }} />
            </ListItem>
          </AppLink>
        }
        {authContext.authenticated &&
          <GroupRouteList
            title="Reading"
            onClick={handleDrawerClose}
            history={history}
            items={[{ path: "/reading/books", title: "Books" }, { path: "/reading/authors", title: "Authors" }, { path: "/reading/categories", title: "Categories" }, { path: "/reading/statuses", title: "Statuses" }]}
            nested={true}
          />
        }
      </List>
    </Fragment>
  );

  return (
    <Fragment>
      <ElevationScroll>
        <AppBar color="primary" elevation={2} className={classes.appBar}>
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
            <Typography variant="h6" className={classes.title} >
              <AppLink to="/">
                <span className={classes.logo}>ME</span>
              </AppLink>
            </Typography>
            <ThemeToggleButton />
            {authContext.authenticated ?
              (
                <IconButton
                  onClick={logout}
                  color="inherit"
                  aria-label="logout">
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
