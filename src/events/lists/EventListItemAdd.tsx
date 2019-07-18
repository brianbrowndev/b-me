import React, {  useEffect, Fragment, useState, useRef,  RefObject } from 'react';
import { Event } from '../../common/client/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './EventListItemAdd.scss';

interface EventListItemAddProps {
    onChange (evt:React.FormEvent):void;
    event: Event;
    onSubmit ():void;
}

function EventListItemAdd(props:EventListItemAddProps) {

    const inputEl: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const [isSaving, setIsSaving] = useState<Boolean>();

    const onFormSubmit = (evt: React.FormEvent) => {
        if (evt) evt.preventDefault();
        onSubmit();
    }
    const onSubmit = () => {
        if (validateModel()) {
            setIsSaving(true);
            props.onSubmit();
        }
    }

    const validateModel = ():boolean => {
        if (props.event.name == null || props.event.name == "") return false;
        return true;
    }

    /**
     * After an event is added, reset the form
     */
    useEffect(() => {
        if (isSaving === true) {
            setIsSaving(false);

            if (inputEl !== null && inputEl.current != null) { 
                inputEl.current.value = '';
                inputEl.current.focus();
            }
        }
    }, [props.event])

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
                            onChange={props.onChange}
                            onBlur={onSubmit}
                            required
                            placeholder="Add an event"
                            disabled={isSaving ? true : false}
                            name="name">
                        </input>
                    </div>
                </form>
        </Fragment>
   );
}

export default EventListItemAdd;
