import React, { useEffect, useState } from 'react';
const ReactMarkdown = require('react-markdown/with-html')
// import ReactMarkdown from 'react-markdown/with-html';

 

 

function About() {
    const [text, setText] = useState('');
    useEffect(
        (() => {
            fetch('./org/life.html').then(r => r.text()).then(t => setText(t))
            }), 
        [] // only call the fetch once by passing in empty params
    );

    return (
        <ReactMarkdown
        source={text}
        escapeHtml={false}
        />
    );
}

export default About;
