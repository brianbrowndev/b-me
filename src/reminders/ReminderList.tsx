import React, { useState, useEffect, Fragment } from 'react';
import { resolve } from 'url';

const DATA = [
    {
        id: 1,
        date:"12/07/1989",
        name:"Birthday Bash"
    }
]

async function fetchReminders() {
    let data = new Promise<Array<any>>((resolve, reject) => resolve(DATA))
    return await data.then(r => r);
    // return await fetch('test').then(r => r.json);
}


function ReminderList () {
    const [reminders, setReminders] = useState<Array<any>>([]);
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
                    <li key={item.id}>
                        Hello
                    </li>
                ))}
            </ul>
            )}
        </Fragment>
    );


}

export default ReminderList;