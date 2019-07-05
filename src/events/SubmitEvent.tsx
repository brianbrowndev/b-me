import React, { Component, Fragment, useState } from 'react';
import moment from 'moment';
import Event from './Event.interface';
import EventApi from './EventApi';
import {
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";

import './SubmitEvent.scss';

function SubmitEvent() {
    const [error, setError] = useState(false);
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const initialEventState = {
        date:moment().format('YYYY-MM-DD'),
        time:moment().format('HH:mm')
     } as Event;
    const [event, setEvent] = useState(initialEventState)

    const onChange = (evt: React.FormEvent) => {
        const { name, value } = evt.target as any
        setEvent({ ...event, [name]: value })
    }
    const onCheckedChange = (evt: React.FormEvent) => {
        const { name, checked } = evt.target as any
        setEvent({ ...event, [name]: checked })
    }

    const submit = (evt: React.FormEvent) => { 
        if (evt) evt.preventDefault();
        EventApi.postEvent(event).then(() => setRedirectToReferrer(true)).catch(err => {
            setError(err)
        });
    }

    return (
        <Fragment>
            { redirectToReferrer ? (
                <Redirect to="/upcoming" />
            ) : (
            <Fragment>

                { error && <div>Submit failed. <br/></div> }
                <div>
                    <strong>New Event</strong>
                </div>
                <form onSubmit={submit}>
                    <div className="Name-input">
                        <label>
                            name: 
                            <input 
                                type="text" 
                                onChange={onChange}
                                defaultValue={event.name}
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
                                defaultValue={event.date}
                                onChange={onChange}
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
                                defaultValue={event.time}
                                onChange={onChange}>
                            </input>
                        </label>
                    </div>

                    {/* <div className="Location-input">
                        <label>
                            location: 
                            <input 
                                type="text" 
                                onChange={onChange}
                                defaultValue={event.location}
                                name="location">
                            </input>
                        </label>
                    </div>
                    <div className="Url-input">
                        <label>
                            url: 
                            <input 
                                type="text" 
                                onChange={onChange}
                                defaultValue={event.url}
                                name="url">
                            </input>
                        </label>
                    </div>
                    <div className="Important-input">
                        <label>
                            <input 
                                type="checkbox" 
                                name="important" 
                                onChange={onCheckedChange}
                                defaultChecked={event.important}
                            ></input>
                            important
                        </label>
                    </div>
                    <div className="Important-input">
                        <label>Reoccuring:
                            <select 
                                name="reoccuringType" 
                                defaultValue={event.reoccuringType} 
                                onChange={onChange}>
                                <option value=""></option>
                                <option value="1">Hourly</option>
                                <option value="2">Daily</option>
                                <option value="3">Weekly</option>
                                <option value="4">Monthly</option>
                                <option value="5">Yearly</option>
                            </select>
                        </label>
                    </div> */}
                    <input type="submit" value="Submit" />
                </form>
            </Fragment>
        )}
        </Fragment>
   );
}

export default SubmitEvent;
