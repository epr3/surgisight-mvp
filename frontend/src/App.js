import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Router, Link } from '@reach/router';

import Home from './views/Home';
import Broadcast from './views/Broadcast';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Link to="/">Home</Link>
        <Link to="/broadcast">Broadcast</Link>
      </header>
      <Router>
        <Home path="/" />
        <Broadcast path="/broadcast" />
      </Router>
    </div>
  );
}

export default App;
