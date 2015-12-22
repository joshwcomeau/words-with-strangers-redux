// NEEDS WORK. UNFINISHED

import { createStore, applyMiddleware } from 'redux';
import thunk                            from 'redux-thunk';

import { socketMiddleware }             from '../middleware';
import rootReducer                      from '../reducers';

const createStoreWithMiddleware = applyMiddleware(
  thunk, socketMiddleware
)(createStore);

export default function configureStore(initialState, socket) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  return store
}
