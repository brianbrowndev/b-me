import React, { Component, useState, Fragment } from 'react';
import auth0, { AuthOptions } from 'auth0-js';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  RouteProps
} from "react-router-dom";
import { RouteChildrenProps } from 'react-router';

const Auth = {
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


export function Login(props: RouteChildrenProps) {
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");
    let { from } = props.location.state || { from: { pathname: "/" } };

    const realm:string = "Test";
    const audience:string = 'localhost:5000/api';
    const auth = new auth0.WebAuth({
        audience: audience,
        domain: 'bgeo.auth0.com',
        clientID: 'LvwH7Wr1Iir3prvhmbvn4Qx6xDxz47JB',
        // specify your desired callback URL
        callbackURL: 'http://localhost:3000',
        responseType: 'token id_token',
        scope: 'openid'
    } as AuthOptions);
 
    function login(event: React.FormEvent): void {
        event.preventDefault();
        auth.client.login({
            realm: realm,
            username: username,
            password: pw,
            audience: audience
        }, (err, authResult) => {
            if (err) {
                setRedirectToReferrer(true);
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
                <div>
                    <strong>Login</strong>
                </div>
                <form onSubmit={login}>
                    <div className="Login-input">
                        <label>
                            username: 
                            <input 
                                type="text" 
                                onChange={e => setUsername(e.target.value)}
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
                                onChange={e => setPw(e.target.value)}
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




// const AuthButton = withRouter(
//   ({ history }) =>
//     Auth.isAuthenticated ? (
//       <p>
//         Welcome!{" "}
//         <button
//           onClick={() => {
//             Auth.logout(() => history.push("/"));
//           }}
//         >
//           Sign out
//         </button>
//       </p>
//     ) : (
//       <p>You are not logged in.</p>
//     )
// );

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
