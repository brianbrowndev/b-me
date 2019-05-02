import React, { Component, Fragment, useState } from 'react';

import './Login.scss';

function Login() {
    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");

    function login(event: React.FormEvent) {
        event.preventDefault();
        console.log(username)
        console.log(pw)
    }

    return (
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
   );
}

export default Login;
