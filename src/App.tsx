import React, { Component } from 'react';
import './App.scss';

import Header from './core/Header';
import {PrivateRoute} from './core/Auth';
import Login from './core/Login';
import About from './core/About';

import EventList from './events/lists/EventList';
import { BrowserRouter as Router, Route } from "react-router-dom";
import {AuthProvider} from './core/Auth';


import { ThemeProvider } from '@material-ui/styles';

import theme from './theme/theme';
import OrgRoute from './org/OrgRoute';


class App extends Component {
  render() {
    return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <div className="App">
            <Header />
            <main>
              <Route exact path="/" component={About} />
              <Route exact path="/org/*" component={OrgRoute} />
              <PrivateRoute exact path="/upcoming" component={EventList} />
              <Route exact path="/login" component={Login} />
            </main>
            <footer></footer>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
    );
  }
}

export default App;
