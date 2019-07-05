import React from 'react';

import './EventListItem.scss';


function EventListItem (props:any) {
    return  <div className='Event-list-item'>{props.children}</div>;

}

export default EventListItem;