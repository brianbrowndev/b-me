import React, { Component } from 'react';
import './App.scss';

import Header from './core/Header';
import Login from './core/Login';

import PublicReminderList from './reminders/PublicReminderList';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
          <div className="App">
            <Header />
            <main>
              <Route exact path="/" component={PublicReminderList} />
              <Route exact path="/login" component={Login} />
            </main>
            <footer></footer>
          </div>
      </Router>
    );
  }
}

export default App;
