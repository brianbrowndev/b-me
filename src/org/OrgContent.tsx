import React, { useEffect, useState, useMemo, useContext } from 'react';
import OrgApi from '../common/client/OrgApi'
import { OrgContext, OrgItem } from './OrgContext';
import { Typography, Container, createStyles, makeStyles, Theme } from '@material-ui/core';
import { SwaggerException } from '../common/client';
const DOMPurify = require('dompurify')

const useStyles = makeStyles((theme: Theme) =>
  {
    return createStyles({
        OrgContent: {
            fontFamily:'Roboto, Helvetica, Arial, sans-serif !important',
            paddingTop:'20px',
            paddingBottom:'20px',
           "& h2,h3,h4,h5,h6": {
                borderBottom: '1px solid #eaecef',
                paddingBottom: ".3em",
                fontWeight:400
            },

            "& table": {
                display:'block',
                overflow:'auto',
                width:'100%',
                "& tr": {
                    backgroundColor: '#fff',
                    borderTop: '1px solid #c6cbd1'
                },

                "& tr td, & tr th": {
                    border: '1px solid #dfe2e5',
                    padding: '6px 13px'
                },

                "& tbody tr:nth-child(2n)": {
                    backgroundColor: '#f6f8fa'
                }
            },

            "& .org-dl dt": {
                fontWeight:'bold',
                paddingLeft:'20px'
            }
        },
        orgTitle: {
            borderBottom:"none"
        },

 
    });
});
 

interface OrgContentProps {
    url:string; 
}

function OrgContent(props:OrgContentProps) {

    const classes = useStyles();

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
        <Container className={classes.OrgContent}>
            <Typography variant="h3" className={classes.orgTitle}>
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
    ), [text, item, error, classes]);
}

export default OrgContent;
