import React          from 'react';
import { Route }      from 'react-router';
import Layout         from './components/layout/index.jsx';
import GameContainer  from './containers/GameContainer.jsx';

export default (
  <Route name="app" component={Layout} path="/">
    <Route component={GameContainer} path="game" />
  </Route>
);
