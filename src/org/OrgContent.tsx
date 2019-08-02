import React, { useEffect, useState, useMemo } from 'react';
import OrgApi from '../common/client/OrgApi'
import './OrgContent.scss';
const DOMPurify = require('dompurify')


// ideally the api would drive what content is available for org related items
type OrgContentName  = 'raleigh';
interface OrgContentProps {
    name: OrgContentName
}
 

function OrgContent(props:OrgContentProps) {
    const [text, setText] = useState('');
    useEffect(
        (() => {
            switch (props.name) {
                case 'raleigh':
                    OrgApi.getPlaces('raleigh').then(t => setText(t))
                    break;
                default:
                    break;
            }
            }), 
        [] // only call the fetch once by passing in empty params
    );

    return useMemo(() => (
        <div className="Org-content">
            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}} />
        </div>
    ), [text]);
}

export default OrgContent;
