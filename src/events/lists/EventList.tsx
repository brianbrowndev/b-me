import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Event, SwaggerException } from '../../common/client/index';
import EventListItem from './EventListItem';
import EventApi  from '../../common/client/EventApi';
import EventListItemAdd from './EventListItemAdd';
import EventListItemView from './EventListItemView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppSnackbar from '../../core/components/AppSnackbar';

async function fetchEvents(): Promise<Event[]> {
    return await EventApi.getEvents();
}


function EventList () {
    //eventlist
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

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
        return () => {
            const newEvent = {...event};
            newEvent.complete = !newEvent.complete;
            EventApi.updateEvent((newEvent.id as number), newEvent).then(() => {
                setEvents(prevEvents => prevEvents.map((e) => {
                    if (e.id === newEvent.id) {
                        return newEvent;
                    }
                    return e;
                }));
            }).catch(err => {
                setError(`Updating Event Error: ${err.message}`);
                setEvents(prevEvents => prevEvents.map((e) => {
                    if (e.id === newEvent.id) {
                        return {...event};
                    }
                    return e;
                }));
            });
        }
    }

    // add
    const initialAddEventState = {} as Event;
    const [addEvent, setAddEvent] = useState<Event>({...initialAddEventState});

    const onAddEventChange = (evt: React.FormEvent) => {
        const { name, value } = evt.target as any
        setAddEvent({ ...addEvent, [name]: value })
    }

    const onAddCheckedChange = (evt: React.FormEvent) => {
        const { name, checked } = evt.target as any
        setAddEvent({ ...addEvent, [name]: checked })
    }

    const handleEventAdd = () => { 
        EventApi.createEvent(addEvent).then(result => {
            setAddEvent({...initialAddEventState});
            setEvents(events.concat(result));
        }).catch((err: SwaggerException) => {
            console.error(err);
            setError(`Adding Event Error: ${err.message}`);
            setAddEvent({...initialAddEventState});
        });
    }


    return (
        // A framgent can be used in place of div to not return extra nodes
        <Fragment>
            { isLoading ? (
                <div>
                    <FontAwesomeIcon icon="spinner" pulse />
                    &nbsp;Loading ...
                </div>
            ) : (
            <div>
                <ul className="fa-ul">
                    {events.map(item => (
                        <EventListItem key={item.id}>
                            <EventListItemView 
                                event={item}
                                onCompleteChange={onCompleteChanged(item)}
                            />
                        </EventListItem>
                    ))}
                    <EventListItem>
                        <EventListItemAdd
                            onChange={onAddEventChange}
                            event={addEvent}
                            onSubmit={handleEventAdd}
                        />
                    </EventListItem>
                </ul>
                <AppSnackbar 
                    message={error}
                    onClose={() => setError('')}
                />
           </div>

            )}
        </Fragment>
    );


}

export default EventList;