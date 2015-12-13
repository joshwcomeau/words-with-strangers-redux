import React          from 'react';
import { Route }      from 'react-router';
import App            from './components/index.jsx';
import GameContainer  from './containers/GameContainer.jsx';

export default (
  <Route name="app" component={App} path="/">
    <Route component={GameContainer} path="game" />
  </Route>
);
