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
      return state.merge( fromJS({
        game: {
          rack: action.payload
        }
      }));
    default:
      return state
  }
}
