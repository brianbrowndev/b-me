import React, { useEffect, useState } from 'react';
import OrgApi from '../common/client/OrgApi'
const DOMPurify = require('dompurify')

 

 

function About() {
    const [text, setText] = useState('');
    useEffect(
        (() => {
            OrgApi.getRaleigh().then(t => setText(t))
            }), 
        [] // only call the fetch once by passing in empty params
    );

    return (
        <div className="Org-container">
            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}} />
        </div>
    );
}

export default About;
