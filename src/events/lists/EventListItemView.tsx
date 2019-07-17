import React, { useState, useEffect, RefObject, useRef, Fragment } from 'react';
import { Event } from '../../common/client/index';

import './EventListItemView.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventCompleteCheckbox from './EventCompleteCheckbox';

interface EventListItemViewProps {
    event: Event;
    onCompleteChange(): void;
};

function EventListItemView (props: EventListItemViewProps) {

    return  (
        <Fragment>
            <EventCompleteCheckbox event={props.event} onCheckboxClick={props.onCompleteChange} />
            {props.event.name}
        </Fragment>

    );

}

export default EventListItemView;