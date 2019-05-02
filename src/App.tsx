import React, { Component } from 'react';
import './App.scss';

import Header from './core/Header';
import {Login, PrivateRoute} from './core/Auth';
import About from './core/About';

import ReminderList from './reminders/ReminderList';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
          <div className="App">
            <Header />
            <main>
              <Route exact path="/" component={About} />
              <PrivateRoute exact path="/reminders" component={ReminderList} />
              <Route exact path="/login" component={Login} />
            </main>
            <footer></footer>
          </div>
      </Router>
    );
  }
}

export default App;
