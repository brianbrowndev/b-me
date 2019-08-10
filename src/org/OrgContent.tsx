import React, { useEffect, useState, useMemo, useContext } from 'react';
import OrgApi from '../common/client/OrgApi'
import './OrgContent.scss';
import { OrgContext, OrgItem, OrgGroup } from './OrgContext';
import { Typography } from '@material-ui/core';
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
            function findOrgItem (group: OrgGroup, url:string): OrgItem | null {
                for (let items of Object.values(group)) 
                    for (let item of items as OrgItem[]) 
                        if (url === item.path) return item;
                return null;
            }
            const item = findOrgItem(orgContext.routes, props.url);
            if (item !== null) {
                setItem(item);
                OrgApi.get(item.filePath).then(t => setText(t))
            }
        }),
        [props.url, orgContext.routes]
    );


    return useMemo(() => (
        <div className="Org-content">
            <Typography variant="h4">
            {item && item.title}
            </Typography>
            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}} />
        </div>
    ), [text, item]);
}

export default OrgContent;
