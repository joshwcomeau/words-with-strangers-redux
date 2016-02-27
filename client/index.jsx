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
import configureStore           from '../common/store';
import { authenticationSuccess} from '../common/actions/auth.actions';

import * as _                   from 'lodash';
import actionCreatorIndex       from '../common/actions/index';
import {
  ADD_GAMES_TO_LIST
} from '../common/constants/actions.constants';

const baseUrl = window.location.protocol + '//' + window.location.host;
const sockets = [
  io(),
  io(`${baseUrl}/game`),
  io(`${baseUrl}/gamesList`)
]
const store         = configureStore(initialState, sockets);


// The server may emit events to the client over any of the sockets.
// We don't really care, in _this_ direction, which socket gets used,
// it'll dispatch its action regardless.
function dispatchOnSocketEvent(socket) {
  // First, we have to modify the socket to catch all custom events.
  // Too much of a pain otherwise to write separate event handlers for every
  // possible action.
  const originalOnevent = socket.onevent;
  socket.onevent = function(packet) {
    const args = packet.data || [];

    // Call the original event, so things like 'connection' are unaltered.
    originalOnevent.call(this, packet);

    // Add in the catch-all keyword, '*', to the list of args
    packet.data.unshift('*');

    // Call again, with the new catch-all keyword in place
    originalOnevent.call(this, packet);
  }

  socket.on('*', (event, data) => {
    // Find the action creator that corresponds to this event.
    const actionName = _.camelCase(event);
    const actionCreator = actionCreatorIndex[actionName];

    // Invoke the action creator with the server's data!
    // By convention, all action creators should accept no more than
    // 1 argument. This way, we can just pass on the server data.
    store.dispatch( actionCreator(data) );
  });
}

sockets.forEach(dispatchOnSocketEvent);

const initialState  = window.__INITIAL_STATE__;
const rootElement   = document.getElementById('app');

const history       = createBrowserHistory();

const selectRoutingState = state => state.toJS().routing;
syncReduxAndRouter(history, store, selectRoutingState);

require('./scss/main.scss');

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
