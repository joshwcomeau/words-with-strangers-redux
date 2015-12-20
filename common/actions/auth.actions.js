import * as _ from 'lodash';

import {
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  LOGOUT,
  ENABLE_REGISTRATION,
  DISABLE_REGISTRATION
} from '../constants/actions.constants';
import {
  closeMenu,
  setAndDisplayFlash
} from './ui.actions';


export function authenticationSuccess(payload) {
  _.extend(payload, {
    authenticated: true
  });
  return {
    type: AUTHENTICATION_SUCCESS,
    payload
  };
}


export function authenticationFailure(err) {
  return {
    type: AUTHENTICATION_FAILURE,
    payload: err
  }
}


export function login(credentials) {
  // Thunk that
  //   - Dispatches a 'BEGIN_LOGIN' message right away.
  //   - makes an async request to the server to request user data + auth token
  //     - on success, calls:
  //        - AUTHENTICATION_SUCCESS with the server's data
  //        - CLOSE_MENU to dismiss the login menu
  //        - SET_AND_DISPLAY_FLASH to indicate that we've sucessfully logged in
  //     - on failure, calls
  //        - AUTHENTICATION_FAILURE with an appropriate error message.


  return function(dispatch, getState) {
    return authenticate('/api/authenticate', credentials)
      .then( evaluateResponse )
      .then( payload => {
        dispatch(authenticationSuccess(payload));
        dispatch(closeMenu());
        dispatch(setAndDisplayFlash('notice', "Successfully logged in"));
      })
      .catch( err => {
        dispatch(authenticationFailure(err));
      });
  }
}


export function register(credentials) {
  return function(dispatch, getState) {
    return authenticate('/api/register', credentials)
      .then( evaluateResponse )
      .then( payload => {
        dispatch(authenticationSuccess(payload));
        // TODO: Routing. Move the user beyond the registration page!
      })
      .catch( err => {
        dispatch(authenticationFailure(err));
      });
  }
}


export function logout() {
  return {
    type: LOGOUT
  }
}

export function enableRegistration() {
  return {
    type: ENABLE_REGISTRATION
  }
}

export function disableRegistration() {
  return {
    type: DISABLE_REGISTRATION
  }
}



// HELPERS
function authenticate(route, credentials) {
  return fetch(route, {
    method: 'post',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
}

function evaluateResponse(response) {
  if ( response.status < 300 ) {
    return response.json();
  } else {
    // Fetch has an extremely annoying API.
    // In order to access both the status code AND the response JSON,
    // I have to jump through this hoop of resolving the promise and then
    // throwing an exception with the resolved data.
    return response.json().then( (payload) => {
      throw payload;
    })
  }
}
