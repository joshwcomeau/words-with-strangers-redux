import { Map, fromJS }  from 'immutable';
import {
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  LOGOUT,
  ENABLE_REGISTRATION,
  DISABLE_REGISTRATION,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAILURE

} from '../constants/actions.constants';

// Initial state for the 'user' slice of the state.
export const initialState = Map({
  authenticated: false
});

export default function user(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATION_SUCCESS:
      return fromJS(action.payload);
    case AUTHENTICATION_FAILURE:
      return state.set('error', fromJS(action.payload));
    case LOGOUT:
      return initialState;
    case ENABLE_REGISTRATION:
      return state.set('registrationEnabled', true);
    case DISABLE_REGISTRATION:
      return state.set('registrationEnabled', false);

    default:
      return state
  }
}
