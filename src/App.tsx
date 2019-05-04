import React, { Component } from 'react';
import './App.scss';

import Header from './core/Header';
import {Login, PrivateRoute} from './core/Auth';
import About from './core/About';

import ReminderList from './reminders/ReminderList';
import SubmitReminder from './reminders/SubmitReminder'
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
          <div className="App">
            <Header />
            <main>
              <Route exact path="/" component={About} />
              <PrivateRoute exact path="/upcoming" component={ReminderList} />
              <PrivateRoute exact path="/submit" component={SubmitReminder} />
              <Route exact path="/login" component={Login} />
            </main>
            <footer></footer>
          </div>
      </Router>
    );
  }
}

export default App;
