import React, { Component, Fragment, useState } from 'react';

import './SubmitReminder.scss';

function SubmitReminder() {
    // const [username, setUsername] = useState("");
    // const [pw, setPw] = useState("");

    function submit(event: React.FormEvent) {
    }

    return (
        <Fragment>

            <div>
                <strong>New Reminder</strong>
            </div>
            <form onSubmit={submit}>
                {/* <div className="Login-input">
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
                </div> */}
                <input type="submit" value="Submit" />

            </form>
        </Fragment>
   );
}

export default SubmitReminder;
