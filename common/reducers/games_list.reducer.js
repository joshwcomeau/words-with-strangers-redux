import * as _                 from 'lodash';
import { List, Map, fromJS }  from 'immutable';
import {
  ADD_GAMES_TO_LIST,
  JOIN_GAME,
  CREATE_GAME
} from '../constants/actions.constants';

// Initial state for the 'game_list' slice of the state.
export const initialState = List();

export default function game(state = initialState, action) {
  switch (action.type) {
    case ADD_GAMES_TO_LIST:
      return state.concat( fromJS(action.games) )

    default:
      return state
  }
}
