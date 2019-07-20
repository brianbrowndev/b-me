import React, { Fragment, useContext } from 'react';


import {AuthContext } from './Auth'

import {
  BrowserRouter as Router,
  Link,
  NavLink,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import './Header.scss';
import { Typography, Divider, Icon } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Header({ history}: RouteComponentProps) {
    const authContext = useContext(AuthContext);
    return (
        <AppBar position="static" color="primary" elevation={0}>
        {/* // <header className="App-header"> */}
            <Toolbar>
                {/* <div className="App-header-logo">
                    <Link to="/"><strong className="App-title">Events</strong></Link>
                </div> */}

                <Icon>
                    <FontAwesomeIcon icon='wind'  />
                </Icon>
                <Divider/>
                <Typography variant="h6" >
                    Mythic
                </Typography>
                { authContext.authenticated ? (
                    <div className="App-header-nav">
                        <div>
                            <NavLink exact to="/upcoming" activeClassName="App-header-nav--active">upcoming</NavLink>
                            {/* &nbsp;|&nbsp; */}
                            {/* <NavLink exact to="/submit" activeClassName="App-header-nav--active">submit</NavLink> */}
                        </div>
                        <div>
                            {authContext.username}&nbsp;|&nbsp;
                            <button className="Logout-button"
                            onClick={() => {
                                authContext.logout(() => history.push("/"));
                            }}>
                            logout
                            </button>
                        </div>
                    </div>
            ) : (
                <div className="App-header-login">
                    <Link to="/login">login</Link>
                </div>
                )}
            </Toolbar>
        </AppBar>
        // {/* // </header> */}
    );
}




export default withRouter(Header);
