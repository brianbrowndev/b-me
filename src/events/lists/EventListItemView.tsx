import React, { Fragment, useEffect } from 'react';
import { Event } from '../../common/client/index';

import './EventListItemView.scss';
import BooleanSubmitIcon from '../../core/components/BooleanSubmitIcon';

interface EventListItemViewProps {
    event: Event;
    onCompleteChange(): void;
};

function EventListItemView (props: EventListItemViewProps) {

    return  (
        <Fragment>
            <BooleanSubmitIcon
                state={{status:props.event.complete}}
                onClick={props.onCompleteChange}
                falseIcon={['far', 'square']}
                trueIcon={['far', 'check-square']}
                isListIcon={true}
                />
            {props.event.name}
        </Fragment>

    );

}

export default EventListItemView;