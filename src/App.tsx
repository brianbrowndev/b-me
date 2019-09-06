import React from 'react';

import { BrowserRouter as Router } from "react-router-dom";
import {AuthProvider} from './core/Auth';


import { OrgProvider } from './org/OrgContext';
import {  CssBaseline } from '@material-ui/core';
import Main from './Main';
import { AppThemeContextProvider } from './theme/AppThemeContext';


function App () {
  return (
  <AppThemeContextProvider>
    <Router>
      <CssBaseline />
      <AuthProvider>
      <OrgProvider>
        <Main></Main>
      </OrgProvider>
      </AuthProvider>
    </Router>
  </AppThemeContextProvider>
  );
}


export default App;
