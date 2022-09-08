import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import logo from './trivia.png';
import Login from './pages/Login';
import './App.css';
import Settings from './pages/Settings';
import Game from './pages/Game';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route path="/settings" component={ Settings } />
      <Route path="/game" component={ Game } />
    </Switch>
    // <div className="App">
    //   <Login />
    // </div>
  );
}
