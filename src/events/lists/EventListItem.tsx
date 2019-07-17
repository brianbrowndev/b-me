import React from 'react';

import './EventListItem.scss';


function EventListItem (props:any) {
    return  <li className='Event-list-item'>{props.children}</li>;

}

export default EventListItem;