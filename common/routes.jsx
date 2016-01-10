import React                  from 'react';
import { IndexRoute, Route }  from 'react-router';
import LayoutContainer        from './containers/LayoutContainer.jsx';
import GameContainer          from './containers/GameContainer.jsx';
import GamesListContainer     from './containers/GamesListContainer.jsx';
import RegisterContainer      from './containers/RegisterContainer.jsx';

export default (
  <Route name="app" component={LayoutContainer} path="/">
    <IndexRoute component={GamesListContainer} />

    <Route component={GameContainer} path="games/:gameId" />
    <Route component={RegisterContainer} path="register" />
  </Route>
);
