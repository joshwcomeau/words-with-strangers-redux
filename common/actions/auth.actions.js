import * as _           from 'lodash';

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
  return fetch(API_URLS.authenticate, {
    method: 'post',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
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

export function loginFailure(payload) {
  _.extend(payload, {
    authenticated: false
  });
  return {
    type: LOGIN_FAILURE,
    payload
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
    return authenticate(credentials).then(
      user => {
        console.log("Authentication successful!", user)
        dispatch(loginSuccess(user));
        dispatch(closeMenu());
        dispatch(setAndDisplayFlash('notice', "Successfully logged in"));
      },
      err => {
        console.log("Authentication failed", err);
        dispatch(loginFailure(err));
      }
    );
  }
  return {
    type:   LOGIN,
    user
  };
}

export function logout() {
  return {
    type: LOGOUT
  }
}
