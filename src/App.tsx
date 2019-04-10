import React, { Component } from 'react';
import './App.scss';

import Header from './core/Header';

import PublicReminderList from './reminders/PublicReminderList';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <main>
          <PublicReminderList />

        </main>
        <footer></footer>
      </div>
    );
  }
}

export default App;
