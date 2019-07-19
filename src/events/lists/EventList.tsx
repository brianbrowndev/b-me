import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Event, SwaggerException } from '../../common/client/index';
import EventListItem from './EventListItem';
import EventApi  from '../../common/client/EventApi';
import EventListItemAdd from './EventListItemAdd';
import EventListItemView from './EventListItemView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppSnackbar from '../../core/components/AppSnackbar';


function EventList () {
    //eventlist
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(
        (() => {
            EventApi.getEvents().then((events) => {
                setEvents(events)
                setIsLoading(false);
            }).catch(err => {
                setError(`Error fetching events: ${err.message}`)
                setEvents([]);
            });
        }), 
        [] // only call the fetch once by passing in empty params
    );

    // view
    const [events, setEvents] = useState<Array<Event>>([]);

    const onEventUpdate = (event: Event) => {
        setEvents(prevEvents => prevEvents.map((e) => {
            if (e.id === event.id) {
                return event;
            }
            return e;
        }));
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
                                onUpdate={onEventUpdate}
                                onError={(err) => setError(err)}
                            />
                        </EventListItem>
                    ))}
                    <EventListItem>
                        <EventListItemAdd
                            onAdd={(event) => setEvents(events.concat(event))}
                            onError={(err) => setError(err)}
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