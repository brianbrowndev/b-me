import React, { useState, useEffect, Fragment } from 'react';
import PublicReminder from './PublicReminder.interface';
import PublicReminderListItem from './PublicReminderListItem';

const DATA: Array<PublicReminder> = [
    {
        id: 1,
        category: 'Birthday',
        date: new Date(),
    }
]

async function fetchReminders() {
    let data = new Promise<Array<PublicReminder>>((resolve, reject) => resolve(DATA))
    return await data.then(r => r);
    // return await fetch('test').then(r => r.json);
}


function PublicReminderList () {
    const [reminders, setReminders] = useState<Array<PublicReminder>>([]);
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
                    <PublicReminderListItem key={item.id} value={item} />
                ))}
            </ul>
            )}
        </Fragment>
    );


}

export default PublicReminderList;