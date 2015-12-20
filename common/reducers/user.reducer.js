import { Map, fromJS }             from 'immutable';
import {
  LOGIN,
  LOGOUT
} from '../constants/actions.constants';

// Initial state for the 'user' slice of the state.
export const initialState = Map();

export default function user(state = Map(), action) {
  switch (action.type) {
    case LOGIN:
      return fromJS(action.user);
    case LOGOUT:
      // Just reset to the initial state. No data to see here.
      return Map();

    default:
      return state
  }
}
