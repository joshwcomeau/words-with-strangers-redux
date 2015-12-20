import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';
import * as _                 from 'lodash';


import authReducer, {initialState} from '../../common/reducers/auth.reducer';

import {
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  LOGOUT,
  ENABLE_REGISTRATION,
  DISABLE_REGISTRATION
}   from '../../common/constants/actions.constants';


describe('authReducer', () => {
  const exampleSuccessResponse = {
    authenticated:  true,
    token:          'ABC123JWT',
    user: {
      username:     'josh',
      profilePhoto: 'photo.jpg'
    }
  };
  const exampleFailureResponse = {
    type:           'username_not_found',
    details:        "Sorry, we couldn't find a user with that username."
  }

  describe('general reducer conditions', () => {
    it('returns input state when an unknown action is provided', () => {
      const state = fromJS(exampleSuccessResponse);
      const action = { type: '123nonsense' };
      const nextState = authReducer(state, action);

      expect(nextState).to.equal(state);
    });

    it('returns default state when none is provided', () => {
      const action = { type: '123nonsense' };
      const nextState = authReducer(undefined, action);

      expect(nextState).to.equal(initialState);
    });
  });

  describe('AUTHENTICATION_SUCCESS', () => {
    it('updates the state with the user, token, and auth status.', () => {
      const state = Map({ authenticated: false });
      const action = {
        type: AUTHENTICATION_SUCCESS, payload: exampleSuccessResponse
      };
      const nextState = authReducer(state, action);

      expect(nextState).to.equal(fromJS(exampleSuccessResponse));
    });

    it('clears any previous auth errors', () => {
      const state = Map({
        authenticated: false,
        error: {
          type: 'username_exists',
          details: 'Sorry, some jerk already took that username!'
        }
      });
      const action = {
        type: AUTHENTICATION_SUCCESS, payload: exampleSuccessResponse
      };
      const nextState = authReducer(state, action);

      expect(nextState).to.equal(fromJS(exampleSuccessResponse))
    });
  });


  it('handles AUTHENTICATION_FAILURE', () => {
    const state = initialState;
    const action = {
      type: AUTHENTICATION_FAILURE, payload: exampleFailureResponse
    };
    const nextState = authReducer(state, action);

    expect(nextState).to.equal(fromJS({
      authenticated: false,
      error: exampleFailureResponse
    }));
  });

  it('handles LOGOUT', () => {
    const state = fromJS({ user: exampleSuccessResponse });
    const action = {
      type: LOGOUT
    };
    const nextState = authReducer(state, action);

    expect(nextState).to.equal(initialState);
  });

  it('handles ENABLE_REGISTRATION', () => {
    const state = fromJS({ authenticated: false });
    const action = {
      type: ENABLE_REGISTRATION
    };
    const nextState = authReducer(state, action);

    expect(nextState).to.equal(fromJS({
      authenticated: false,
      registrationEnabled: true
    }));
  });


  it('handles DISABLE_REGISTRATION', () => {
    const state = fromJS({ registrationEnabled: true });
    const action = {
      type: DISABLE_REGISTRATION
    };
    const nextState = authReducer(state, action);

    expect(nextState).to.equal(fromJS({ registrationEnabled: false }));
  });

});
