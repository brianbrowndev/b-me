import React from 'react';


import {Auth } from './Auth'

import {
  BrowserRouter as Router,
  Link,
  NavLink,
  withRouter
} from "react-router-dom";

import './Header.scss';

const Header = withRouter(
    ({ history}) =>
        <header className="App-header">
            <div className="App-header-left">
                <Link to="/"><strong className="App-title">Reminders</strong></Link>
                { Auth.isAuthenticated && 
                    <div className="App-header-nav">
                        <NavLink exact to="/upcoming" activeClassName="App-header-nav--active">upcoming</NavLink>
                        &nbsp;|&nbsp;
                        <NavLink exact to="/submit" activeClassName="App-header-nav--active">submit</NavLink>
                    </div>
                }
            </div>
            { Auth.isAuthenticated ? (
                <div>
                    {/* TODO - get current user logged in */}
                    {"brian"}&nbsp;|&nbsp;
                    <button className="Logout-button"
                    onClick={() => {
                        Auth.logout(() => history.push("/"));
                    }}>
                    logout
                    </button>
                </div>
            ) : (
                <Link to="/login">login</Link>
            )}
        </header>
);



export default Header;
