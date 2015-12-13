import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';

import * as constants         from '../../common/constants/actions.constants';
import gameReducer            from '../../common/reducers/game.reducer';


describe('gameReducer', () => {
  it('handles ADD_TILES_TO_RACK', () => {
    const initialState = fromJS({
      board: [],
      rack: []
    });
    const action = {
      type: constants.ADD_TILES_TO_RACK,
      tiles: [
        { letter: 'A' },
        { letter: 'B' },
        { letter: 'C' }
      ]
    };
    const nextState = gameReducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      board: [],
      rack: [
        { letter: 'A' },
        { letter: 'B' },
        { letter: 'C' }
      ]
    }));
  })
});
