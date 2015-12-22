import 'babel-polyfill';
import 'isomorphic-fetch';
import io                       from 'socket.io-client';
import React                    from 'react';
import { render }               from 'react-dom';
import { Router }               from 'react-router';
import { Provider }             from 'react-redux';
import { fromJS }               from 'immutable';
import jwtDecode                from 'jwt-decode';
import createBrowserHistory     from 'history/lib/createBrowserHistory';
import { syncReduxAndRouter }   from 'redux-simple-router'

import routes                   from '../common/routes.jsx';
import configureStore           from '../common/store/configureStore.client';
import { authenticationSuccess} from '../common/actions/auth.actions';

const initialState  = window.__INITIAL_STATE__;

const socket        = io()
const store         = configureStore(initialState, socket);
const rootElement   = document.getElementById('app');

const history       = createBrowserHistory();

const selectRoutingState = state => state.toJS().routing;
syncReduxAndRouter(history, store, selectRoutingState);

require('../common/scss/main.scss');

// Log the user in, if a JWT exists in localStorage
const token = localStorage.getItem('wws_auth_token');
if ( token ) store.dispatch(authenticationSuccess(token, false));

render(
  (
    <Provider store={store}>
      <Router children={routes} history={history} />
    </Provider>
  ),
  rootElement
);
