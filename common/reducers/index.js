import { Map, List, fromJS }  from 'immutable';
import { routeReducer }       from 'redux-simple-router';

import auth       from './auth.reducer';
import game       from './game.reducer';
import gamesList  from './games_list.reducer';
import ui         from './ui.reducer';


const rootReducer = ( state = Map(), action ) => {
  // Because state coming from the server will be in plain JS, we will do
  // all mutable-to-immutable conversion from within this root reducer.
  const immutable_state = fromJS(state);

  return Map({
    // Each top-level key here has a child reducer that manages that part
    // of the state. These reducers are defined in their own files, and
    // they take their slice of the state, as well as the action invoked.
    game: game(
      immutable_state.get('game'),
      action
    ),
    gamesList: gamesList(
      immutable_state.get('gamesList'),
      action
    ),
    auth: auth(
      immutable_state.get('auth'),
      action
    ),
    ui: ui(
      immutable_state.get('ui'),
      action
    ),
    routing: routeReducer(
      immutable_state.get('routing'),
      action
    )
  });
}

export default rootReducer
