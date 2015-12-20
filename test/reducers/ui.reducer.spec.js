import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';

import uiReducer, {initialState} from '../../common/reducers/ui.reducer';

import {
  OPEN_MENU,
  CLOSE_MENU,
  SET_AND_DISPLAY_FLASH,
  DISMISS_FLASH
}   from '../../common/constants/actions.constants';


describe('uiReducer', () => {
  describe('general reducer conditions', () => {
    it('returns input state when an unknown action is provided', () => {
      const state = fromJS({ menu: 'account' });
      const action = { type: '123nonsense' };
      const nextState = uiReducer(state, action);

      expect(nextState).to.equal(state);
    });

    it('returns default state when none is provided', () => {
      const action = { type: '123nonsense' };
      const nextState = uiReducer(undefined, action);

      expect(nextState).to.equal(initialState);
    });
  });

  it('handles OPEN_MENU', () => {
    const state = Map();
    const action = {
      type: OPEN_MENU, menu: 'account'
    };
    const nextState = uiReducer(state, action);

    expect(nextState).to.equal(fromJS({
      menu: 'account'
    }));
  });

  it('handles CLOSE_MENU', () => {
    const state = Map({ menu: 'account' });
    const action = {
      type: CLOSE_MENU
    };
    const nextState = uiReducer(state, action);

    expect(nextState).to.equal(Map());
  });

  it('handles SET_AND_DISPLAY_FLASH', () => {
    const state = Map({ menu: 'account' });
    const action = {
      type: SET_AND_DISPLAY_FLASH,
      flash: {
        type: 'error',
        message: "You can't do that!"
      }
    };
    const nextState = uiReducer(state, action);

    expect(nextState).to.equal(fromJS({
      menu: 'account',
      flash: {
        type: 'error',
        message: "You can't do that!"
      }
    }));
  });

  describe('DISMISS_FLASH', () => {
    it('removes an existing flash message', () => {
      const state = fromJS({
        flash: {
          type: 'alert',
          message: "It's your turn!"
        }
      });
      const action = {
        type: DISMISS_FLASH
      };
      const nextState = uiReducer(state, action);

      expect(nextState).to.equal(Map());
    });

    it('does nothing when there is no flash', () => {
      const state = fromJS({
        menu: 'account'
      });
      const action = {
        type: DISMISS_FLASH
      };
      const nextState = uiReducer(state, action);

      expect(nextState).to.equal(state);
    });
  });

});
