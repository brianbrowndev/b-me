import React, { useState, useEffect, Fragment } from 'react';
import Event from '../../common/interfaces/Event.interface';
import EventListItem from './EventListItem';
import EventApi  from '../../common/api/EventApi';
import AddEventListItem from './AddEventListItem';
import EventListItemView from './EventListItemView';

async function fetchEvents(): Promise<Event[]> {
    return await EventApi.getEvents();
}


function EventList () {
    //eventlist
    const [isLoading, setIsLoading] = useState(false);

    // view
    const [events, setEvents] = useState<Array<Event>>([]);

    // add
    const [error, setError] = useState(false);
    const initialEventState = {
    } as Event;
    const [event, setEvent] = useState(Object.assign({}, initialEventState));

    const onEventChange = (evt: React.FormEvent) => {
        const { name, value } = evt.target as any
        setEvent({ ...event, [name]: value })
    }

    const onCheckedChange = (evt: React.FormEvent) => {
        const { name, checked } = evt.target as any
        setEvent({ ...event, [name]: checked })
    }

    const handleEventAdd = () => { 
        EventApi.postEvent(event).then(result => {
            setEvent(Object.assign({}, initialEventState));
            setEvents(events.concat(result));
        }).catch(err => {
            setError(err)
        });
    }

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
            <div>
                {events.map(item => (
                    // <EventListItem key={item.id} value={item} />
                    <EventListItem key={item.id}>
                        <EventListItemView value={item}/>
                    </EventListItem>
                ))}
                <EventListItem>
                    <AddEventListItem
                        onChange={onEventChange}
                        value={event}
                        onSubmit={handleEventAdd}
                    />
                </EventListItem>
            </div>
            )}
        </Fragment>
    );


}

export default EventList;