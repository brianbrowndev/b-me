import React, { useEffect, useState, useMemo, useContext } from 'react';
import OrgApi from '../common/client/OrgApi'
import './OrgContent.scss';
import { OrgContext, OrgItem } from './OrgContext';
import { Typography, Container } from '@material-ui/core';
const DOMPurify = require('dompurify')


interface OrgContentProps {
    url:string; 
}

function OrgContent(props:OrgContentProps) {
    const orgContext = useContext(OrgContext);

    const [item, setItem] = useState<OrgItem>();
    const [text, setText] = useState('');

    useEffect(
        (() => { 

            const item = orgContext.findOrgItemByPath(props.url);
            if (item !== null) {
                setItem(item);
                OrgApi.get(item.filePath).then(t => setText(t))
            }
        }),
        [props.url, orgContext]
    );


    return useMemo(() => (
        <Container className="Org-content">
            <Typography variant="h1" className="Org-title">
            {item && item.title}
            </Typography>
            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}} />
        </Container>
    ), [text, item]);
}

export default OrgContent;
