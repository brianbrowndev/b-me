import React from 'react';
import OrgContent from './OrgContent';
import { match } from 'react-router';


const OrgRoute = (params: {match: match}) => <OrgContent url={params.match.url} />

export default OrgRoute;
