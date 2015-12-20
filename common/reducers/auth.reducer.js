import { Map, fromJS }  from 'immutable';
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from '../constants/actions.constants';

// Initial state for the 'user' slice of the state.
export const initialState = Map({
  authenticated: false
});

export default function user(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return fromJS(action.payload);
    case LOGIN_FAILURE:
      return fromJS(action.payload);
    case LOGOUT:
      return initialState;

    default:
      return state
  }
}
