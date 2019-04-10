import React, { Component } from 'react';
import './App.scss';

import Header from './core/Header';

import ReminderList from './reminders/ReminderList';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <main>
          <ReminderList />

        </main>
        <footer></footer>
      </div>
    );
  }
}

export default App;
