import React, { useState, useEffect, Fragment } from 'react';
import Reminder from './Reminder.interface';
import ReminderListItem from './ReminderListItem';

const DATA: Array<Reminder> = [
    {
        id: 1,
        category: 'Birthday',
        date: new Date(),
    }
]

async function fetchReminders() {
    let data = new Promise<Array<Reminder>>((resolve, reject) => resolve(DATA))
    return await data.then(r => r);
    // return await fetch('test').then(r => r.json);
}


function ReminderList () {
    const [reminders, setReminders] = useState<Array<Reminder>>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(
        (() => {
            // iife the async call
            (async () => {
                setIsLoading(true);
                setReminders(await fetchReminders())
                setIsLoading(false);
            })()
        }), 
        [] // only call the fetch once by passing in empty params
    );

    return (
        // A framgent can be used in place of div to not return extra nodes
        <Fragment>
            { isLoading ? (
                <div>Loading ...</div>
            ) : (
            <ul>
                {reminders.map(item => (
                    <ReminderListItem key={item.id} value={item} />
                ))}
            </ul>
            )}
        </Fragment>
    );


}

export default ReminderList;