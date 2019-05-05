import React, { Component, useState, Fragment } from 'react';
import auth0, { AuthOptions } from 'auth0-js';


import './Auth.scss';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  RouteProps
} from "react-router-dom";
import { RouteChildrenProps } from 'react-router';

export const Auth = {
    isAuthenticated: false,
    authenticate(cb:Function): void {
        // Check whether the id_token is expired or not
        let expires= localStorage.getItem('expires_at');
        const expiresAt = expires != null ? JSON.parse(expires) : expires;
        this.isAuthenticated = new Date().getTime() < expiresAt;
        cb();
    },
    logout(cb:Function): void {
        this.isAuthenticated = false;
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        cb();
    }
}
Auth.authenticate(() => {}); // TODO - Doesn't seem like a good practice


export function Login(props: RouteChildrenProps) {
    const [redirectToReferrer, setRedirectToReferrer] = useState(Auth.isAuthenticated);
    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");
    const [error, setError] = useState(false);
    let { from } = props.location.state || { from: { pathname: "/upcoming" } };

    const auth = new auth0.WebAuth({
        audience: process.env.REACT_APP_AUTH_AUDIENCE,
        domain: process.env.REACT_APP_AUTH_DOMAIN,
        clientID: process.env.REACT_APP_AUTH_CLIENT_ID,
        callbackURL: 'http://localhost:3000',
        responseType: 'token id_token',
        scope: 'openid'
    } as AuthOptions);
 
    function login(event: React.FormEvent): void {
        event.preventDefault();
        auth.client.login({
            realm: process.env.REACT_APP_AUTH_REALM as string,
            username: username,
            password: pw,
            audience: process.env.REACT_APP_AUTH_AUDIENCE as string
        }, (err, authResult) => {
            if (err) {
                setError(true);
            }
            else if (authResult && authResult.accessToken && authResult.idToken) {
                setUser(authResult);
                Auth.authenticate(() => setRedirectToReferrer(true));
            }
        });
    }

    function setUser(authResult:any): void {
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    return (
        <Fragment>
            { redirectToReferrer ? (
                <Redirect to={from} />
            ) : (
            <Fragment>
                { error && <div>Login failed. <br/></div> }
                <div>
                    <strong>Login</strong>
                </div>
                <form onSubmit={login}>
                    <div className="Login-input">
                        <label>
                            username: 
                            <input 
                                type="text" 
                                onChange={e => setUsername(e.target.value.trim())}
                                required
                                name="username">
                            </input>
                        </label>
                    </div>
                    <div className="Login-input">
                        <label>
                            password: 
                            <input 
                                type="password" 
                                onChange={e => setPw(e.target.value.trim())}
                                required
                                name="pw">
                            </input>
                        </label>
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </Fragment>
            )}
        </Fragment>
   );
}

interface PrivateRouteProps extends RouteProps {
    component: React.ComponentType<any> 
}

export function PrivateRoute( props: PrivateRouteProps ) {
    let { component: Component, ...rest} = props;
    return (
        <Route
        {...rest}
        render={props =>
            Auth.isAuthenticated ? (
            <Component {...props} />
            ) : (
            <Redirect
                to={{
                pathname: "/login",
                state: { from: props.location }
                }}
            />
            )
        }
        />
    );
}

