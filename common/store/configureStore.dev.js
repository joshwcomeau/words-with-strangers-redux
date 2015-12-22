import { createStore, applyMiddleware, compose }  from 'redux';
import thunk                                      from 'redux-thunk';

import rootReducer          from '../reducers';
import DevTools             from '../containers/DevTools.jsx';

import {
  loggerMiddleware,
  socketMiddleware
} from '../middleware';


let loadedSocketMiddleware;

const createStoreWithMiddleware = compose(
  applyMiddleware(loggerMiddleware, loadedSocketMiddleware, thunk),
  DevTools.instrument()
)(createStore);

export default function configureStore(initialState, socket) {
  // On the client, we pass a socket into configureStore.
  // this is a middleware step for sending data from client to server.
  loadedSocketMiddleware = socketMiddleware(socket);
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  // For testing purposes, attach the store to the window
  // (only on the client, obviously);
  if ( typeof window !== 'undefined' ) window.__store = store;

  return store
}
