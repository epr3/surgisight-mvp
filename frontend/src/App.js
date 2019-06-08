import React from 'react';
import './App.css';
import { Router } from '@reach/router';

import Home from './views/Home';
import Broadcast from './views/Broadcast';

function App() {
  return (
    <div className="App">
      <Router>
        <Home path="/" />
        <Broadcast path="/broadcast" />
      </Router>
    </div>
  );
}

export default App;
