import React, { useState, useEffect, Fragment } from 'react';
import Event from './Event.interface';
import EventListItem from './EventListItem';
import { Api } from '../core/Api';

async function fetchEvents(): Promise<Event[]> {
    return await Api.get<Event[]>('events');
}


function EventList () {
    const [events, setEvents] = useState<Array<Event>>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(
        (() => {
            // iife the async call
            (async () => {
                setIsLoading(true);
                setEvents(await fetchEvents())
                setIsLoading(false);
            })()
        }), 
        [] // only call the fetch once by passing in empty params
    );

    return (
        // A framgent can be used in place of div to not return extra nodes
        <Fragment>
            { isLoading ? (
                <div>Loading ...</div>
            ) : (
            <ul>
                {events.map(item => (
                    <EventListItem key={item.id} value={item} />
                ))}
            </ul>
            )}
        </Fragment>
    );


}

export default EventList;