import { Map, List, fromJS }  from 'immutable';
import game                   from './game.reducer';


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
    players:  List() // TODO: Manage this part of the state.
  });
}

export default rootReducer
