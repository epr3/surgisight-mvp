import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Router, Link } from '@reach/router';

import Home from './views/Home';
import Broadcast from './views/Broadcast';
import Legend from './components/Legend';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Router>
        <Home path="/" />
        <Broadcast path="/broadcast" />
      </Router>
      <Legend/>
    </div>
  );
}

export default App;
