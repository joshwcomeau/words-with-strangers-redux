import * as _     from 'lodash';
import jwtDecode  from 'jwt-decode';

import {
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  LOGOUT,
  ENABLE_REGISTRATION,
  DISABLE_REGISTRATION
} from '../constants/actions.constants';
import {
  closeMenu,
  updateFlashMessage
} from './ui.actions';
import { pushPath } from 'redux-simple-router';

export function authenticationSuccess(token, saveToLocal = true) {
  if ( saveToLocal ) localStorage.setItem('wws_auth_token', token);

  return {
    type: AUTHENTICATION_SUCCESS,
    payload: {
      authenticated: true,
      user: jwtDecode(token),
      token
    }
  };
}


export function authenticationFailure(err) {
  localStorage.removeItem('wws_auth_token');
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
      .then( response => {
        dispatch(authenticationSuccess(response.token));
        dispatch(closeMenu());
        dispatch(updateFlashMessage("Successfully logged in", 'notice'));
      })
      .catch( err => {
        console.log("LOGIN ERROR", err)
        dispatch(authenticationFailure(err));
      });
  }
}


export function register(credentials) {
  return function(dispatch, getState) {
    return authenticate('/api/register', credentials)
      .then( evaluateResponse )
      .then( response => {
        dispatch(authenticationSuccess(response.token));
        dispatch(pushPath('/'))
      })
      .catch( err => {
        dispatch(authenticationFailure(err));
      });
  }
}


export function logout() {
  localStorage.removeItem('wws_auth_token');
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
// TODO: Move this into middleware!
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
