import React            from 'react';
import { Route }        from 'react-router';
import LayoutContainer  from './containers/LayoutContainer.jsx';
import GameContainer    from './containers/GameContainer.jsx';

export default (
  <Route name="app" component={LayoutContainer} path="/">
    <Route component={GameContainer} path="game" />
  </Route>
);
