import React, { useState, useEffect, Fragment } from 'react';
import { Event } from '../../common/client/index';
import EventListItem from './EventListItem';
import EventApi  from '../../common/client/EventApi';
import AddEventListItem from './AddEventListItem';
import EventListItemView from './EventListItemView';

async function fetchEvents(): Promise<Event[]> {
    return await EventApi.getEvents();
}


function EventList () {
    //eventlist
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

    // view
    const [events, setEvents] = useState<Array<Event>>([]);

    const onCompleteChanged = (event:Event) => {
        return (evt: React.FormEvent) => {
            const { name, checked } = evt.target as any;
            event = {...event, [name]:checked};
            EventApi.updateEvent((event.id as number), event).then(() => {
                setEvents(prevEvents => prevEvents.map((e) => {
                    if (e.id === event.id) {
                        return event;
                    }
                    return e;
                }));
            }).catch(err => {
                setAddError(err)
            });
 
        }
    }

    // add
    const [addError, setAddError] = useState(false);
    const initialAddEventState = {} as Event;
    const [addEvent, setAddEvent] = useState({...initialAddEventState});

    const onAddEventChange = (evt: React.FormEvent) => {
        const { name, value } = evt.target as any
        setAddEvent({ ...addEvent, [name]: value })
    }

    const onAddCheckedChange = (evt: React.FormEvent) => {
        const { name, checked } = evt.target as any
        setAddEvent({ ...addEvent, [name]: checked })
    }

    const handleEventAdd = () => { 
        EventApi.insertEvent(addEvent).then(result => {
            setAddEvent({...initialAddEventState});
            setEvents(events.concat(result));
        }).catch(err => {
            setAddError(err)
        });
    }

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
                        <EventListItemView 
                            event={item}
                            onCompleteChange={onCompleteChanged(item)}
                        />
                    </EventListItem>
                ))}
                <EventListItem>
                    <AddEventListItem
                        onChange={onAddEventChange}
                        event={addEvent}
                        onSubmit={handleEventAdd}
                    />
                </EventListItem>
            </div>
            )}
        </Fragment>
    );


}

export default EventList;