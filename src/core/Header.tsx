import React, {Fragment} from 'react';


import {AuthConsumer } from './Auth'

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
            <AuthConsumer>
                {({ authenticated, username, logout}) => (
                    <Fragment>
                        <div className="App-header-logo">
                            <Link to="/"><strong className="App-title">Events</strong></Link>
                        </div>
                        { authenticated ? (
                            <div className="App-header-nav">
                                <div>
                                    <NavLink exact to="/upcoming" activeClassName="App-header-nav--active">upcoming</NavLink>
                                    &nbsp;|&nbsp;
                                    <NavLink exact to="/submit" activeClassName="App-header-nav--active">submit</NavLink>
                                </div>
                                <div>
                                    {username}&nbsp;|&nbsp;
                                    <button className="Logout-button"
                                    onClick={() => {
                                        logout(() => history.push("/"));
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
                )}
           </AuthConsumer>
        </header>
);



export default Header;
