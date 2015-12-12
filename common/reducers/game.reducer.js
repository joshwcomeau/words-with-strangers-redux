import { List, Map, fromJS } from 'immutable';
import { GENERATE_NEW_TILES } from '../actions/game.actions';

const initialState = fromJS({
  game: {
    board: [],
    rack:  []
  }
});

export default function game(state = initialState, action) {
  switch (action.type) {
    case GENERATE_NEW_TILES:
      return action.payload
    case INCREMENT_COUNTER:
      return state + 1
    case DECREMENT_COUNTER:
      return state - 1
    default:
      return state
  }
}
