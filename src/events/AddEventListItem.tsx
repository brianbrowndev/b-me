import React, {  useEffect, Fragment, useState, useRef,  RefObject } from 'react';
import Event from './Event.interface';
import './AddEventListItem.scss';

interface AddEventListItemProps {
    onChange (evt:React.FormEvent):void;
    value: Event;
    onSubmit (evt: React.FormEvent):void;
}

function AddEventListItem(props:AddEventListItemProps) {

    const inputEl: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    // not the best to have a ternary to check if null or false
    const [isSaving, setIsSaving] = useState<Boolean | null>(null);

    const onSubmit = (evt: React.FormEvent) => {
        setIsSaving(true);
        props.onSubmit(evt);
    }

    useEffect(() => {
        if (isSaving != null) setIsSaving(false);
    }, [props.value])

    useEffect(() => {
        if (inputEl !== null && inputEl.current != null && isSaving == false) { 
            inputEl.current.focus();
        }
    }, [isSaving])

    return (

        <Fragment>
            { isSaving ? ( 
                <div>Saving ...</div>
            ) :  (
                <form onSubmit={onSubmit}>
                    <div className="Name-input">
                        <span className="Event-add-icon">+</span>
                        <input 
                            ref={inputEl} 
                            className="Event-add"
                            type="text" 
                            onChange={props.onChange}
                            defaultValue={props.value.name}
                            required
                            placeholder="Add an event"
                            name="name">
                        </input>
                    </div>
                </form>
            )
            }

        </Fragment>
   );
}

export default AddEventListItem;
