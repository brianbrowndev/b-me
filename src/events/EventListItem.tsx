import React from 'react';
import Event from "./Event.interface";

function EventListItem (props: {value: Event}) {
    return  <li>{props.value.name} - {props.value.date.toString()}</li>;

}

export default EventListItem;