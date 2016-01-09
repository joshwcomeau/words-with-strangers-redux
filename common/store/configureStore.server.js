// Redux Server Store.
// This actually does very little.
// It exists to build a State object that can be sent to the client on
// server-side render.

import { createStore, applyMiddleware } from 'redux';
import thunk                            from 'redux-thunk';

import rootReducer from '../reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  return store
}
