import React              from 'react';
import { Route }          from 'react-router';
import LayoutContainer    from './containers/LayoutContainer.jsx';
import GameContainer      from './containers/GameContainer.jsx';
import GamesListContainer from './containers/GamesListContainer.jsx';
import RegisterContainer  from './containers/RegisterContainer.jsx';

export default (
  <Route name="app" component={LayoutContainer} path="/">
    <Route component={GameContainer} path="game" />
    <Route component={GamesListContainer} path="games" />
    <Route component={RegisterContainer} path="register" />
  </Route>
);
