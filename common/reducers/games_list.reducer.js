import * as _                 from 'lodash';
import { List, Map, fromJS }  from 'immutable';
import {
  ADD_GAMES_TO_LIST,
  GAME_STATUS_CHANGED
} from '../constants/actions.constants';

// Initial state for the 'game_list' slice of the state.
export const initialState = List();

export default function game(state = initialState, action) {
  switch (action.type) {
    case ADD_GAMES_TO_LIST:
      return state.concat( fromJS(action.games) );

    case GAME_STATUS_CHANGED:
      // Find the index of the changed game
      let gameIndex = state.findIndex( game => game._id === action.game._id );

      // Create our new game: current state props except action status
      let newGame = state.get(gameIndex).set('status', action.game.status);

      return state.set(gameIndex, newGame);

    default:
      return state
  }
}
