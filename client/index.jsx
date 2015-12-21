import 'babel-polyfill';
import 'isomorphic-fetch';
import React                  from 'react';
import { render }             from 'react-dom';
import { Router }             from 'react-router';
import { Provider }           from 'react-redux';
import { fromJS }             from 'immutable';
import createBrowserHistory   from 'history/lib/createBrowserHistory';
import { syncReduxAndRouter } from 'redux-simple-router'

import routes               from '../common/routes.jsx';
import configureStore       from '../common/store/configureStore';

const initialState  = window.__INITIAL_STATE__;
const store         = configureStore(initialState);
const rootElement   = document.getElementById('app');

const history       = createBrowserHistory();

const selectRoutingState = state => state.toJS().routing;
syncReduxAndRouter(history, store, selectRoutingState);

require('../common/scss/main.scss')

render(
  (
    <Provider store={store}>
      <Router children={routes} history={history} />
    </Provider>
  ),
  rootElement
);
