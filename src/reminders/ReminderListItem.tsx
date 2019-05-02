import React from 'react';
import Reminder from "./Reminder.interface";

function ReminderListItem (props: {value: Reminder}) {
    return  <li>{props.value.category} - {props.value.date.toString()}</li>;

}

export default ReminderListItem;