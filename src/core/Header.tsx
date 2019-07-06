import React, { Fragment, useContext } from 'react';


import {AuthContext } from './Auth'

import {
  BrowserRouter as Router,
  Link,
  NavLink,
  withRouter,
  RouteComponentProps
} from "react-router-dom";

import './Header.scss';

function Header({ history}: RouteComponentProps) {
    const authContext = useContext(AuthContext);
    return (
        <header className="App-header">
            <Fragment>
                <div className="App-header-logo">
                    <Link to="/"><strong className="App-title">Events</strong></Link>
                </div>
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
            </Fragment>
        </header>
    );
}




export default withRouter(Header);
