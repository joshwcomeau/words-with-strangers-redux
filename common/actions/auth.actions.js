import * as _       from 'lodash';

import { API_URLS } from '../constants/config.constants';
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from '../constants/actions.constants';
import {
  closeMenu,
  setAndDisplayFlash
} from './ui.actions';


function authenticate(credentials) {
  console.log("Sending", JSON.stringify(credentials));
  return fetch(API_URLS.authenticate, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
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

export function loginSuccess(payload) {
  _.extend(payload, {
    authenticated: true
  });
  return {
    type: LOGIN_SUCCESS,
    payload
  };
}

export function loginFailure(err) {
  _.extend(err, {
    authenticated: false
  });
  return {
    type: LOGIN_FAILURE,
    payload: err
  }
}


export function login(credentials) {
  // Thunk that
  //   - Dispatches an 'ATTEMPTING_LOGIN' message right away.
  //   - makes an async request to the server to request user data + auth token
  //     - on success, calls:
  //        - LOGIN_SUCCESS with the server's data
  //        - CLOSE_MENU to dismiss the login menu
  //        - SET_AND_DISPLAY_FLASH to indicate that we've sucessfully logged in
  //     - on failure, calls
  //        - LOGIN_FAILURE with an appropriate error message.


  return function(dispatch, getState) {
    return authenticate(credentials)
      .then( evaluateResponse )
      .then( payload => {
        dispatch(loginSuccess(payload));
        dispatch(closeMenu());
        dispatch(setAndDisplayFlash('notice', "Successfully logged in"));
      })
      .catch( err => {
        // This is an actual exception, not a failed login attempt.
        dispatch(loginFailure(err));
      });
  }
}

export function logout() {
  return {
    type: LOGOUT
  }
}
