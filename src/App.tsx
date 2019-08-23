import React from 'react';

import { BrowserRouter as Router } from "react-router-dom";
import {AuthProvider} from './core/Auth';


import { ThemeProvider } from '@material-ui/styles';

import theme from './theme/theme';
import { OrgProvider } from './org/OrgContext';
import {  CssBaseline } from '@material-ui/core';
import Main from './Main';


function App () {
  return (
  <ThemeProvider theme={theme}>
    <Router>
      <CssBaseline />
      <AuthProvider>
      <OrgProvider>
        <Main></Main>
      </OrgProvider>
      </AuthProvider>
    </Router>
  </ThemeProvider>
  );
}


export default App;
