import { List, Map, fromJS }  from 'immutable';
import { ADD_TILES_TO_RACK } from '../constants/actions.constants';

// Initial state for the 'game' slice of the state.
const initialState = fromJS({
  board: [],
  rack:  []
});

export default function game(state = initialState, action) {
  switch (action.type) {
    case ADD_TILES_TO_RACK:
      return state.mergeIn( ['rack'], action.tiles );

    default:
      return state
  }
}
