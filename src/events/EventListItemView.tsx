import React from 'react';
import Event from "./Event.interface";

import './EventListItemView.scss';

function EventListItemView (props: {value: Event}) {
    return  <div>{props.value.name}</div>;

}

export default EventListItemView;