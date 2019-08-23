import React, { useEffect, useState, useMemo, useContext } from 'react';
import OrgApi from '../common/client/OrgApi'
import './OrgContent.scss';
import { OrgContext, OrgItem } from './OrgContext';
import { Typography, Container } from '@material-ui/core';
import { SwaggerException } from '../common/client';
const DOMPurify = require('dompurify')


interface OrgContentProps {
    url:string; 
}

function OrgContent(props:OrgContentProps) {
    const orgContext = useContext(OrgContext);

    const [item, setItem] = useState<OrgItem>();
    const [text, setText] = useState('');
    const [error, setError] = useState();

    useEffect(
        (() => { 

            const item = orgContext.findOrgItemByPath(props.url);
            if (item !== null) {
                setItem(item);
                OrgApi.get(item.filePath).then(t => setText(t)).catch((e: SwaggerException) => {
                    setError(e.message)
                })
            }
        }),
        [props.url, orgContext]
    );


    return useMemo(() => (
        <Container className="Org-content">
            <Typography variant="h3" className="Org-title">
            {item && item.title}
            </Typography>
            <Typography  color="textSecondary" gutterBottom>
            {item && item.description}
            </Typography>
            { error ? (
                <Typography color="error" variant="overline">Something went wrong, failed to load page.</Typography>
            ) : (
                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}} />
            )}
        </Container>
    ), [text, item, error]);
}

export default OrgContent;
