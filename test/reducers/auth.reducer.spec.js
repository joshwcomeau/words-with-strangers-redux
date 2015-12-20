import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';
import * as _                 from 'lodash';


import authReducer, {initialState} from '../../common/reducers/auth.reducer';

import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
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
    authenticated:  false,
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

  it('handles LOGIN_SUCCESS', () => {
    const state = initialState;
    const action = {
      type: LOGIN_SUCCESS, payload: exampleSuccessResponse
    };
    const nextState = authReducer(state, action);

    expect(nextState).to.equal(fromJS(exampleSuccessResponse));
  });

  it('handles LOGIN_FAILURE', () => {
    const state = initialState;
    const action = {
      type: LOGIN_FAILURE, payload: exampleFailureResponse
    };
    const nextState = authReducer(state, action);

    expect(nextState).to.equal(fromJS(exampleFailureResponse));
  });

  it('handles LOGOUT', () => {
    const state = fromJS({ user: exampleSuccessResponse });
    const action = {
      type: LOGOUT
    };
    const nextState = authReducer(state, action);

    expect(nextState).to.equal(initialState);
  });
});
