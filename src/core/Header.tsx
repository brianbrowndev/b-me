import React, { Fragment, useContext, useState } from 'react';


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
import { OrgContext, OrgItem } from '../org/OrgContext';

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

function ListItemLink(props:{path:string, name:string, onClick?():void}) {
  const classes = useStyles();
  return  (
    <NavLink exact to={props.path} onClick={props.onClick} activeClassName={classes.linkActive} className={classes.link}>
      <ListItem className={classes.listNested} button>
        <ListItemText primary={props.name} />
      </ListItem>
    </NavLink>
  )

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
        {Object.entries(orgContext.routes(authContext.authenticated)).map(([title, items]) => 
          <Fragment key={title}>
            <ListItem>
              <ListItemText primary={title} />
            </ListItem>       
            <List disablePadding component="div">
              {(items as OrgItem[]).map(item => 
                <Fragment key={item.title}>
                  {(!item.authenticate || (item.authenticate && authContext.authenticated)) &&
                    <ListItemLink path={item.path} name={item.title} onClick={handleDrawerClose} />
                  }
                </Fragment>
              )}
              </List>
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
