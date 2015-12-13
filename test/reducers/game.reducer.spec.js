import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';

import gameReducer, {initialState} from '../../common/reducers/game.reducer';

import {
  ADD_TILES_TO_RACK
}   from '../../common/constants/actions.constants';


describe('gameReducer', () => {
  it('returns input state when an unknown action is provided', () => {
    const state = fromJS({ board: [ { letter: 'Q' } ] });
    const action = { type: '123nonsense' };
    const nextState = gameReducer(state, action);

    expect(nextState).to.equal(state);
  });
  it('returns default state when none is provided', () => {
    const action = { type: '123nonsense' };
    const nextState = gameReducer(undefined, action);

    expect(nextState).to.equal(initialState);
  });

  it('handles ADD_TILES_TO_RACK', () => {
    const state = fromJS({ board: [], rack: [] });
    const action = {
      type: ADD_TILES_TO_RACK, tiles: [{ letter: 'A' }, { letter: 'Z' }]
    };
    const nextState = gameReducer(state, action);

    expect(nextState).to.equal(fromJS({
      board: [],
      rack: [{ letter: 'A' }, { letter: 'Z' }]
    }));
  });
});
