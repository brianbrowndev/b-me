import React, {  useEffect, Fragment, useState, useRef,  RefObject } from 'react';
import { Event } from '../../common/client/index';
import './AddEventListItem.scss';

interface AddEventListItemProps {
    onChange (evt:React.FormEvent):void;
    event: Event;
    onSubmit ():void;
}

function AddEventListItem(props:AddEventListItemProps) {

    const inputEl: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    // not the best to have a ternary to check if null or false
    const [isSaving, setIsSaving] = useState<Boolean | null>(null);

    const onFormSubmit = (evt: React.FormEvent) => {
        if (evt) evt.preventDefault();
        if (validateModel()) {
            setIsSaving(true);
            onSubmit();
        }
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

    useEffect(() => {
        if (isSaving != null) setIsSaving(false);
    }, [props.event])

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
                <form onSubmit={onFormSubmit}>
                    <div className="Name-input">
                        <span className="Event-add-icon">+</span>
                        <input 
                            ref={inputEl} 
                            className="Event-add"
                            type="text" 
                            onChange={props.onChange}
                            onBlur={onSubmit}
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
