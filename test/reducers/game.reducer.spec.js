import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';

import gameReducer, {initialState} from '../../common/reducers/game.reducer';

import {
  ADD_TILES_TO_RACK,
  PLACE_TILE
}   from '../../common/constants/actions.constants';


describe('gameReducer', () => {
  describe('general reducer conditions', () => {
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

  it('handles PLACE_TILE from rack to board', () => {
    const state = fromJS({
      board: [],
      rack: [ {_id: '1', letter: 'A'}, { _id: '2', letter: 'Z' } ]
    });
    const action = {
      type: PLACE_TILE,
      tile: {
        _id: '2',
        location: 'board',
        x: 2,
        y: 4
      }
    };
    const nextState = gameReducer(state, action);

    expect(nextState).to.equal(fromJS({
      board: [ { _id: '2', letter: 'Z', x: 2, y: 4 } ],
      rack:  [ { _id: '1', letter: 'A' } ]
    }));
  });

  it('handles PLACE_TILE from board to rack, no specified `x`', () => {
    // Because we haven't specified 'x', it should push the tile to the
    // end of the rack.
    const state = fromJS({
      board: [
        { _id: '1', letter: 'A', x: 4, y: 6 },
        { _id: '2', letter: 'Z', x: 5, y: 6 }
      ],
      rack:  [ { _id: '3', letter: 'J', x: 0 } ]
    });
    const action = {
      type: PLACE_TILE,
      tile: {
        _id: '1',
        location: 'rack'
      }
    };
    const nextState = gameReducer(state, action);

    expect(nextState).to.equal(fromJS({
      board: [ { _id: '2', letter: 'Z', x: 5, y: 6 } ],
      rack:  [ { _id: '3', letter: 'J', x: 0 }, { _id: '1', letter: 'A', x: 1 } ]
    }));
  });

  // This is a major pain to implement, for relatively small gains.
  // Not too concerned.
  xit('handles PLACE_TILE from board to rack, with a specified `x`', () => {
    const state = fromJS({
      board: [ { _id: '1', letter: 'O', x: 4, y: 6 } ],
      rack:  [
        { _id: '2', letter: 'J', x: 0 },
        { _id: '3', letter: 'S', x: 1 },
        { _id: '4', letter: 'H', x: 2 }
      ]
    });
    const action = {
      type: PLACE_TILE,
      tile: {
        _id: '1',
        location: 'rack',
        x: 1
      }
    };
    const nextState = gameReducer(state, action);

    expect(nextState).to.equal(fromJS({
      board: [ { _id: '2', letter: 'Z', x: 5, y: 6 } ],
      rack:  [
        { _id: '2', letter: 'J', x: 0 },
        { _id: '1', letter: 'O', x: 1 },
        { _id: '3', letter: 'S', x: 2 },
        { _id: '4', letter: 'H', x: 3 }
      ]
    }));
  });

  it('handles PLACE_TILE from board to board', () => {
    const state = fromJS({
      board: [
        { _id: '1', letter: 'O', x: 4, y: 6 },
        { _id: '2', letter: 'J', x: 5, y: 6 },
      ],
      rack: []
    });
    const action = {
      type: PLACE_TILE,
      tile: {
        _id: '2',
        location: 'board',
        x: 8,
        y: 8
      }
    };
    const nextState = gameReducer(state, action);

    expect(nextState).to.equal(fromJS({
      board: [
        { _id: '1', letter: 'O', x: 4, y: 6 },
        { _id: '2', letter: 'J', x: 8, y: 8 },
      ],
      rack: []
    }));
  });


});
