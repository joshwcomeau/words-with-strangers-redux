import { createStore, applyMiddleware, compose }  from 'redux';
import thunkMiddleware                            from 'redux-thunk';
import soundsMiddleware                           from 'redux-sounds';

import rootReducer  from '../reducers';
import DevTools     from '../containers/DevTools.jsx';
import sounds       from '../data/sounds';

import {
  loggerMiddleware,
  socketMiddleware,
  favicoMiddleware
} from '../middleware';


export default function configureStore(initialState, sockets = []) {
  // On the client, we pass in an array of sockets.
  // We will create one middleware step for each one.
  // When actions are dispatched, each middleware will check its middleware.
  // if the action has specified its namespace as a remote, the socket will
  // emit an action on that socket with the action data, along with some
  // mixed-in extras (like the current user's auth data.)


  let middlewares = [];
  sockets.forEach( (socket) => middlewares.push( socketMiddleware(socket) ) );

  // Add in our misc middleware:
  middlewares.push( thunkMiddleware );
  middlewares.push( soundsMiddleware(sounds) );
  middlewares.push( favicoMiddleware({ animation: 'fade' }) );

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware.apply(this, middlewares),
      DevTools.instrument()
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  // Allow direct access to the store, for debugging/testing
  window.__store = store;

  return store
}
