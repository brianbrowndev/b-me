import React, { Component, Fragment, useState } from 'react';
import moment from 'moment';

import './SubmitReminder.scss';

function SubmitReminder() {
    const [name, setName] = useState("");
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [time, setTime] = useState(moment().format('h:mm'));
    const [important, setImportant] = useState("No");
    const [reoccuring, setReoccuring] = useState("No");
    const [location, setLocation] = useState("");
    const [url, setUrl] = useState("");
    
    function submit(event: React.FormEvent) {
    }

    return (
        <Fragment>

            <div>
                <strong>New Reminder</strong>
            </div>
            <form onSubmit={submit}>
                <div className="Name-input">
                    <label>
                        name: 
                        <input 
                            type="text" 
                            onChange={e => setName(e.target.value)}
                            required
                            name="name">
                        </input>
                    </label>
                </div>
                <div className="Date-input">
                    <label>
                        date: 
                        <input 
                            type="date" 
                            name="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            min="moment().format('YYYY-MM-DD')">
                        </input>
                    </label>
                </div>
                <div className="Time-input">
                    <label>
                        time: 
                        <input 
                            type="time" 
                            name="time"
                            value={time}
                            onChange={e => setTime(e.target.value)}>
                        </input>
                    </label>
                </div>

                <div className="Location-input">
                    <label>
                        location: 
                        <input 
                            type="text" 
                            onChange={e => setLocation(e.target.value)}
                            name="location">
                        </input>
                    </label>
                </div>
                <div className="Url-input">
                    <label>
                        url: 
                        <input 
                            type="text" 
                            onChange={e => setUrl(e.target.value)}
                            name="url">
                        </input>
                    </label>
                </div>
                <div className="Important-input">
                    <label>
                        <input 
                            type="checkbox" 
                            name="important" 
                            onChange={e => setImportant(e.target.checked ? 'Yes' : 'No')} 
                        ></input>
                        important
                    </label>
                </div>
                <div className="Important-input">
                    <label>
                        <input 
                            type="checkbox" 
                            name="reoccuring" 
                            onChange={e => setReoccuring(e.target.checked ? 'Yes' : 'No')} 
                        ></input>
                       reoccuring 
                    </label>
                </div>
                  <input type="submit" value="Submit" />
            </form>
        </Fragment>
   );
}

export default SubmitReminder;
