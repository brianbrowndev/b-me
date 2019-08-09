import React, { useEffect, useState, useMemo } from 'react';
import OrgApi from '../common/client/OrgApi'
import './OrgContent.scss';
const DOMPurify = require('dompurify')


interface OrgContentProps {
    url:string; 
}
 

function OrgContent(props:OrgContentProps) {
    const [text, setText] = useState('');
    useEffect(
        (() => { 
            OrgApi.get(props.url).then(t => setText(t))
        }), 
        [props.url]
    );

    return useMemo(() => (
        <div className="Org-content">
            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}} />
        </div>
    ), [text]);
}

export default OrgContent;
