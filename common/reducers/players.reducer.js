import { fromJS }             from 'immutable';
import { GENERATE_NEW_TILES } from '../actions/game.actions';

// Initial state for the 'game' slice of the state.
const initialState = fromJS({
  board: [],
  rack:  []
});

export default function game(state = initialState, action) {
  switch (action.type) {
    case GENERATE_NEW_TILES:
      return state.merge( fromJS({
        game: {
          rack: action.payload
        }
      }));
    default:
      return state
  }
}
