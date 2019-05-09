import React, { useState, Fragment, useContext } from 'react';
import auth0, { AuthOptions } from 'auth0-js';


import './Auth.scss';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  RouteProps
} from "react-router-dom";
import { RouteChildrenProps } from 'react-router';

const AuthContext = React.createContext({} as AuthProps);

function AuthProvider (props: any) {
    const [authenticated, setAuthenticated] = useState(isAuthenticated());
    const [username, setUsername] = useState(localStorage.getItem('username') || "");

    const authClient = new auth0.WebAuth({
        audience: process.env.REACT_APP_AUTH_AUDIENCE,
        domain: process.env.REACT_APP_AUTH_DOMAIN,
        clientID: process.env.REACT_APP_AUTH_CLIENT_ID,
        callbackURL: 'http://localhost:3000',
        responseType: 'token id_token',
        scope: 'openid'
    } as AuthOptions)

   
    function expired (): boolean {
        let expires= localStorage.getItem('expires_at');
        const expiresAt = expires != null ? JSON.parse(expires) : expires;
        return new Date().getTime() > expiresAt;
    }
    function isAuthenticated (): boolean {
        let hasToken  = localStorage.getItem('id_token') ? true: false;
        return hasToken && !expired();
    }

    const login = (username:string, pw:string, cb: Function): void => {
        authClient.client.login({
            realm: process.env.REACT_APP_AUTH_REALM as string,
            username: username,
            password: pw,
            audience: process.env.REACT_APP_AUTH_AUDIENCE as string
        }, (err, authResult) => {
            if (err) {
                cb(err, null);
            }
            else if (authResult && authResult.accessToken && authResult.idToken) {
                const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
                localStorage.setItem('access_token', authResult.accessToken);
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('expires_at', expiresAt);
                authClient.client.userInfo(authResult.accessToken, (err, profile) => {
                    if (profile != null) {
                        localStorage.setItem('username', profile.nickname);
                        setUsername(profile.nickname);
                        setAuthenticated(true);
                    }
                });
            }
        })
    }

    const logout = (cb:Function): void => {
        localStorage.clear();
        setAuthenticated(false);
        cb();
    }

 
    return (
      <AuthContext.Provider
        value={{
          authenticated: authenticated,
          login: login,
          logout: logout,
          username: username
        } as AuthProps}
      >
        {props.children}
      </AuthContext.Provider>
    )
}

interface AuthProps {
    authenticated: boolean,
    login(username:string, pw:string, cb:Function): void;
    logout(cb:Function): void;
    username: string;
}



function Login(props: RouteChildrenProps): JSX.Element {
    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");
    const [error, setError] = useState(false);
    let { from } = props.location.state || { from: { pathname: "/upcoming" } };

    function onLogin(err:any, result:any): void {
        if (err) {
            setError(true);
        }
    }

    const authContext = useContext(AuthContext);

    return (
        <Fragment>
            { authContext.authenticated ? (
                <Redirect to={from} />
            ) : (
            <Fragment>
                { error && <div>Login failed. <br/></div> }
                <div>
                    <strong>Login</strong>
                </div>
                <form onSubmit={e=> {e.preventDefault();authContext.login(username, pw, onLogin)}}>
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

function PrivateRoute( props: PrivateRouteProps ): JSX.Element {
    let { component: Component, ...rest} = props;

    const authContext = useContext(AuthContext);
    return (
        <Route
        {...rest}
        render={props =>
            authContext.authenticated ? (
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


export {Login, PrivateRoute, AuthProvider, AuthContext};
