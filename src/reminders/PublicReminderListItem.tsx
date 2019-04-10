import React from 'react';
import PublicReminder from "./PublicReminder.interface";

function PublicReminderListItem (props: {value: PublicReminder}) {
    return  <li>{props.value.category} - {props.value.date.toString()}</li>;

}

export default PublicReminderListItem;