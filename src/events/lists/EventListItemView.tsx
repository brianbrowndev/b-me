import React, { Fragment, useEffect, useState } from 'react';
import { Event } from '../../common/client/index';

import './EventListItemView.scss';
import BooleanSubmitIcon from '../../core/components/BooleanSubmitIcon';

interface EventListItemViewProps {
    event: Event;
    onCompleteChange(): void;
};

function EventListItemView (props: EventListItemViewProps) {


    const [isPending, setIsPending] = useState<boolean>(false);
    
    const handleClick = () => {
        if (isPending !== true) {
            setIsPending(true);
            props.onCompleteChange();
        }
    }

    useEffect(() => {
        if(isPending === true) setIsPending(false)
    }, [props.event])

    return  (
        <Fragment>
            <BooleanSubmitIcon
                isPending={isPending}
                state={props.event.complete}
                onClick={handleClick}
                falseIcon={['far', 'square']}
                trueIcon={['far', 'check-square']}
                isListIcon={true}
                />
            {props.event.name}
        </Fragment>

    );

}

export default EventListItemView;