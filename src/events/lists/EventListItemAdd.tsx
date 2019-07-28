import React, {  Fragment, useState, useRef,  RefObject } from 'react';
import { Event, SwaggerException } from '../../common/client/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './EventListItemAdd.scss';
import EventApi  from '../../common/client/EventApi';

interface EventListItemAddProps {
    onAdd(event: Event):void;
    onError(message:string):void;
}

function EventListItemAdd(props:EventListItemAddProps) {

    const inputEl: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const [isSaving, setIsSaving] = useState<Boolean>();

    // add
    const initialAddEventState = {} as Event;
    const [addEvent, setAddEvent] = useState<Event>({...initialAddEventState});

    const onNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target as any
        setAddEvent({ ...addEvent, [name]: value })
    }

    const propertyOf = (e: keyof Event) => e;

    const handleEventAdd = () => { 
        setIsSaving(true);
        EventApi.createEvent(addEvent).then(result => {
            props.onAdd(result);
            // on success, reset to initial state
            reset();
        }).catch((err: SwaggerException) => {
            props.onError(`Error adding event: ${err.message}`);
            // on error, keep the current state but remove the pending
            setIsSaving(false);
        });
    }

    const reset = () => {
        setIsSaving(false);
        setAddEvent({...initialAddEventState});
        if (inputEl !== null && inputEl.current !== null) { 
            inputEl.current.value = '';
            inputEl.current.focus();
        }
    }

    const onFormSubmit = (evt: React.FormEvent) => {
        if (evt) evt.preventDefault();
        onSubmit();
    }
    const onSubmit = () => {
        if (validateModel()) {
            handleEventAdd();
        }
    }
    const validateModel = ():boolean => {
        if (addEvent.name === null || addEvent.name === "") return false;
        return true;
    }


    return (

        <Fragment>
               <form onSubmit={onFormSubmit}>
                    <div className="Name-input">
                        { isSaving ? ( 
                            <FontAwesomeIcon icon='spinner' pulse listItem />
                        ) :  (
                            <FontAwesomeIcon icon="plus" className="Event-add-icon" listItem />
                        )}
                        <input 
                            ref={inputEl} 
                            className="Event-add"
                            type="text" 
                            onChange={onNameChange}
                            onBlur={onSubmit}
                            required
                            placeholder="Add an event"
                            disabled={isSaving ? true : false}
                            name={propertyOf('name')}>
                        </input>
                    </div>
                </form>
        </Fragment>
   );
}

export default EventListItemAdd;
