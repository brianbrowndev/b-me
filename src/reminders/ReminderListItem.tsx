import React from 'react';
import Reminder from "./Reminder.interface";

function ReminderListItem (props: {value: Reminder}) {
    return  <li>{props.value.name} - {props.value.date.toString()}</li>;

}

export default ReminderListItem;