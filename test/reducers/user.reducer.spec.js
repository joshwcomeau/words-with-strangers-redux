import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';

import userReducer, {initialState} from '../../common/reducers/user.reducer';

import {
  LOGIN,
  LOGOUT
}   from '../../common/constants/actions.constants';


describe('userReducer', () => {
  const exampleUser = {
    username: 'josh',
    profilePhoto: 'photo.jpg'
  }
  describe('general reducer conditions', () => {
    it('returns input state when an unknown action is provided', () => {
      const state = fromJS({ user: exampleUser });
      const action = { type: '123nonsense' };
      const nextState = userReducer(state, action);

      expect(nextState).to.equal(state);
    });

    it('returns default state when none is provided', () => {
      const action = { type: '123nonsense' };
      const nextState = userReducer(undefined, action);

      expect(nextState).to.equal(initialState);
    });
  });

  it('handles LOGIN', () => {
    const state = Map();
    const action = {
      type: LOGIN, user: exampleUser
    };
    const nextState = userReducer(state, action);

    expect(nextState).to.equal(fromJS(exampleUser));
  });

  it('handles LOGOUT', () => {
    const state = fromJS({ user: exampleUser });
    const action = {
      type: LOGOUT
    };
    const nextState = userReducer(state, action);

    expect(nextState).to.equal(Map());
  });
});
