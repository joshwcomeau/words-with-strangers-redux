import * as _                 from 'lodash';
import { OrderedSet, Map, fromJS }  from 'immutable';
import {
  ADD_GAMES_TO_LIST,
  GAME_STATUS_CHANGED
} from '../constants/actions.constants';

// Initial state for the 'game_list' slice of the state.
export const initialState = OrderedSet();

export default function game(state = initialState, action) {
  switch (action.type) {
    case ADD_GAMES_TO_LIST:
      return state.concat( fromJS(action.games) );

    case GAME_STATUS_CHANGED:
      // Find the index of the changed game
      let oldGame = state.find( game => {
        return game.get('id') === action.game.id;
      });

      // Delete the old game, and add in the new one
      return state.delete(oldGame).add( fromJS(action.game) );

    default:
      return state
  }
}
