import { Map, List, fromJS }  from 'immutable';
import game                   from './game.reducer';

// Because state coming from the server will be in plain JS, we will do
// all mutable-to-immutable conversion from within the root reducer.
const initialState = {
  game: {
    board: [],
    rack:  []
  },
  players: []
};

const rootReducer = ( state = initialState, action ) => {
  const immutable_state = fromJS(state);
  return Map({
    game:     game(immutable_state.get('game'), action),
    players:  List() // TODO: Manage this part of the state.
  });
}

export default rootReducer
