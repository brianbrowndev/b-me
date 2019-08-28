import React, { useEffect, useState, useMemo, useContext } from 'react';
import OrgApi from '../common/client/OrgApi'
import { OrgContext, OrgItem } from './OrgContext';
import { Typography, Container, createStyles, makeStyles, Theme } from '@material-ui/core';
import { SwaggerException } from '../common/client';
const DOMPurify = require('dompurify')

const textFontSize = "18px";
const useStyles = makeStyles((theme: Theme) =>
  {
    return createStyles({
        container: {
            paddingTop:'20px',
        },
        title: {
            paddingBottom: theme.spacing(1),
            "&h3": {
                borderBottom:"none"
            }
        },
        subtitle: {
            fontSize: textFontSize
        },
        orgContent: {
            fontFamily:'Roboto, Helvetica, Arial, sans-serif !important',
            paddingBottom: theme.spacing(4),
            paddingTop: theme.spacing(1),
            fontSize: textFontSize,
            lineHeight:1,
           "& h1,h2,h3,h4,h5,h6": {
                margin:0,
            },

            "& h2": {
                borderBottom: '1px solid #eaecef',
                fontSize: "2.3rem",
                fontWeight: 400,
                lineHeight: 1.04,
                letterSpacing: "0em",
                marginBottom:"0.35em"
            },

            "& h3": {
                fontSize: "1.6rem",
                fontWeight: 500,
                letterSpacing: "0em",
                // marginBottom:"0.35em"
            },

 

            "& .outline-2": {
                paddingTop: theme.spacing(4)
            },

            "& .outline-3, .outline-4": {
                paddingTop: theme.spacing(2)
            },



            "& table": {
                display:'block',
                overflow:'auto',
                width:'100%',
                paddingTop: theme.spacing(2),
                "& tr": {
                    backgroundColor: '#fff',
                    borderTop: '1px solid #c6cbd1'
                },

                "& tr td, & tr th": {
                    border: '1px solid #dfe2e5',
                    padding: '6px 13px'
                },

                "& tbody tr:nth-child(2n)": {
                    backgroundColor: theme.palette.primary.light
                }
            },

            "& .org-dl dt": {
                fontWeight:500,
                paddingLeft:theme.spacing(1),
                paddingTop:theme.spacing(2)
            },

            "& a": {
                color: theme.palette.secondary.main,
                textDecoration: "none",
                "&:hover, &:focus": {
                    color: theme.palette.secondary.dark,
                }
            },

            "& li": {
                lineHeight: 1.3,
                paddingTop: theme.spacing(2)
            },

            "& .todo, & .done": {
                fontWeight:500
            },
            "& .todo": {
                color: "#e17055"
            },
            "& .done": {
                color: "#00b894"
            },



            "& .timestamp-kwd": {
                display:'none',
            },
            "& .timestamp": {}
            
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
                setError(null);
                setItem(item);
                OrgApi.get(item.filePath).then(t => setText(t)).catch((e: SwaggerException) => {
                    setError(e.message)
                })
            }
        }),
        [props.url, orgContext]
    );


    return useMemo(() => (
        <Container className={classes.container}>
            <Typography variant="h3" className={classes.title}>
            {item && item.title}
            </Typography>
            <Typography  color="textSecondary" variant="subtitle1" className={classes.subtitle}>
            {item && item.description}
            </Typography>
            { error ? (
                <Typography color="error" variant="overline">Something went wrong, failed to load page.</Typography>
            ) : (
                <div className={classes.orgContent} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}} />
            )}
        </Container>
    ), [text, item, error, classes]);
}

export default OrgContent;
