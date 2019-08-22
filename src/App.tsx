import React, { Component } from 'react';

import Header from './core/Header';
import {PrivateRoute} from './core/Auth';
import Login from './core/Login';
import Home from './core/Home';

import EventList from './events/lists/EventList';
import { BrowserRouter as Router, Route } from "react-router-dom";
import {AuthProvider} from './core/Auth';


import { ThemeProvider, createStyles, makeStyles } from '@material-ui/styles';

import theme from './theme/theme';
import OrgContentRoute from './org/OrgContentRoute';
import { OrgProvider } from './org/OrgContext';
import { Container, CssBaseline, Theme, Box, Toolbar } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  {
    return createStyles({
      app: {
        display:'flex',
        minHeight:'100vh',
        width:'100%',
        margin: '0 auto'
      },
      main: {
        flexGrow:1,
      }
    });
  },
);


function App () {
  const classes = useStyles();
  return (
  <ThemeProvider theme={theme}>
    <Router>
      <CssBaseline />
      <AuthProvider>
      <OrgProvider>
        <div className={classes.app}>
          <Header />
          <main className={classes.main}>
            <Toolbar />
            <Container>
              <Box my={2}>
                <Route exact path="/" component={Home} />
                <Route exact path="/org/*" component={OrgContentRoute} />
                <PrivateRoute exact path="/upcoming" component={EventList} />
                <Route exact path="/login" component={Login} />
              </Box>
            </Container>
          </main>
        </div>
      </OrgProvider>
      </AuthProvider>
    </Router>
  </ThemeProvider>
  );
}

export default App;
