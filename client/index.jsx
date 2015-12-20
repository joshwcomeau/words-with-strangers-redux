import 'babel-polyfill';
import React                from 'react';
import { render }           from 'react-dom';
import { Router }           from 'react-router';
import { Provider }         from 'react-redux';
import { fromJS }           from 'immutable';
import createBrowserHistory from 'history/lib/createBrowserHistory';

require('es6-promise').polyfill();
require('isomorphic-fetch');

import routes               from '../common/routes.jsx';
import configureStore       from '../common/store/configureStore';

const initialState  = window.__INITIAL_STATE__;
const store         = configureStore(initialState);
const rootElement   = document.getElementById('app');

const history       = createBrowserHistory();

require('../common/scss/main.scss')

render(
  (
    <Provider store={store}>
      <Router children={routes} history={history} />
    </Provider>
  ),
  rootElement
);
