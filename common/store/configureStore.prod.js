import { createStore, applyMiddleware } from 'redux';
import thunk                            from 'redux-thunk';

import { logger }                       from '../middleware';
import rootReducer                      from '../reducers';

const createStoreWithMiddleware = applyMiddleware(
  logger,
  thunk
)(createStore);

export default function configureStore(initialState) {
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
