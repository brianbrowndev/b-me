import React from 'react';
import OrgContent from './OrgContent';
import { match } from 'react-router';


const OrgContentRoute = (params: {match: match}) => <OrgContent url={params.match.url} />

export default OrgContentRoute;
