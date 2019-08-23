import React, { Fragment, useState } from 'react';
import { Event, SwaggerException } from '../../common/client/index';

import './EventListItemView.scss';
import EventApi  from '../../common/client/EventApi';

interface EventListItemViewProps {
    event: Event;
    onUpdate(event:Event):void
    onError (err:string):void
};

function EventListItemView (props: EventListItemViewProps) {


    const [isPending, setIsPending] = useState<boolean>(false);
    
    const handleClick = () => {
        if (isPending !== true) {
            setIsPending(true);
            updateEvent();
        }
    }

    const updateEvent = () => {
        const newEvent = {...props.event};
        newEvent.complete = !newEvent.complete;
        EventApi.updateEvent((newEvent.id as number), newEvent).then(() => {
            props.onUpdate(newEvent);
            setIsPending(false);
        }).catch((err: SwaggerException) => {
            props.onError(`Error updating event: ${err.message}`);
            setIsPending(false);
        });
    }

    return  (
        <Fragment>
            {/* <BooleanSubmitIcon
                isPending={isPending}
                state={props.event.complete}
                onClick={handleClick}
                falseIcon={['far', 'square']}
                trueIcon={['far', 'check-square']}
                isListIcon={true}
            /> */}
            {props.event.name}
        </Fragment>

    );

}

export default EventListItemView;