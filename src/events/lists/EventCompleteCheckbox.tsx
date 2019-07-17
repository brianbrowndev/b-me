import React, { useState, useEffect } from 'react';
import { Event } from '../../common/client/index';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './EventCompleteCheckbox.scss';

interface EventCompleteCheckboxProps {
    event: Event;
    onCheckboxClick(): void;
};

function EventCompleteCheckbox (props: EventCompleteCheckboxProps) {

    const [isPending, setIsPending] = useState<boolean>(false);


    const handleClick = () => {
        setIsPending(true);
        props.onCheckboxClick();
    }

    useEffect(() => {
        if (isPending === true) setIsPending(false);
    }, [props.event])

    return  (
        <div className="Checkbox-container" onClick={handleClick}>
            {
                isPending ? (
                    <FontAwesomeIcon icon='spinner' className="Checkbox-pending" pulse listItem />
                ) : (
                    props.event.complete ?
                        <FontAwesomeIcon icon={['far', 'check-square']} listItem />
                    :
                        <FontAwesomeIcon icon={['far', 'square']} listItem />
                )
            }
        </div>

    );

}

export default EventCompleteCheckbox;