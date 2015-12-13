import 'babel-polyfill';
import React                from 'react';
import { render }           from 'react-dom';
import { Router }           from 'react-router';
import { Provider }         from 'react-redux';
import { fromJS }           from 'immutable';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import routes               from '../common/routes.jsx';
import configureStore       from '../common/store/configureStore';
import App                  from '../common/containers/App.jsx';

const initialState  = window.__INITIAL_STATE__;
const store         = configureStore(initialState);
const rootElement   = document.getElementById('app');

const history       = createBrowserHistory();

render(
  (
    <Provider store={store}>
      <Router children={routes} history={history} />
    </Provider>
  ),
  rootElement
);
