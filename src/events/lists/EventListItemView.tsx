import React, { useState, useEffect, RefObject, useRef } from 'react';
import Event from '../../common/interfaces/Event.interface';

import './EventListItemView.scss';

interface EventListItemViewProps {
    event: Event;
    onCompleteChange(evt: React.FormEvent): void;
};

function EventListItemView (props: EventListItemViewProps) {

    const inputEl: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    
    const onCompleteChange  = (evt: React.FormEvent) => {
        if (inputEl !== null && inputEl.current != null) { 
            inputEl.current.disabled = true;
        }
        props.onCompleteChange(evt);
    };

    useEffect( () => {
        if (inputEl !== null && inputEl.current != null) { 
            inputEl.current.disabled = false;
        }
    },[props.event]);

    return  (
        <div>
            <input 
                ref={inputEl} 
                type="checkbox" 
                id={props.event.name} 
                name="complete"
                defaultChecked={props.event.complete}
                onChange={onCompleteChange}></input>
            {props.event.name}
        </div>
    );

}

export default EventListItemView;