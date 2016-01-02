import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';

import gameReducer, {initialState} from '../../common/reducers/game.reducer';

import {
  UNSUBSCRIBE_FROM_GAME,
  ADD_TILES_TO_RACK,
  PLACE_TILE,
  SUBMIT_WORD,
  SHUFFLE_RACK,
  RECALL_TILES_TO_RACK
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

  describe('SUBMIT_WORD', () => {
    // TODO
  });


  describe('UNSUBSCRIBE_FROM_GAME', () => {
    it('restores the initial state', () => {
      const state = fromJS({
        board: [
          { id: '1', letter: 'A', x: 1, y: 4, turnId: 0 },
          { id: '2', letter: 'Z', x: 2, y: 4, turnId: 0 }
        ],
        rack:  [ { id: '3', letter: 'C' } ],
        turns: [
          { id: 0, word: 'AZ'}
        ]
      });
      const action = {
        type: UNSUBSCRIBE_FROM_GAME,
        meta: { remote: '/game' },
        gameId: 1
      };
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(initialState);

    });
  });



  describe('PLACE_TILE', () => {
    it('handles PLACE_TILE from rack to board', () => {
      const state = fromJS({
        board: [],
        rack: [ {id: '1', letter: 'A'}, { id: '2', letter: 'Z' } ]
      });
      const action = {
        type: PLACE_TILE,
        tile: {
          id: '2',
          location: 'board',
          x: 2,
          y: 4
        }
      };
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(fromJS({
        board: [ { id: '2', letter: 'Z', x: 2, y: 4 } ],
        rack:  [ { id: '1', letter: 'A' } ]
      }));
    });

    it('handles PLACE_TILE from board to rack, no specified `x`', () => {
      // Because we haven't specified 'x', it should push the tile to the
      // end of the rack.
      const state = fromJS({
        board: [
          { id: '1', letter: 'A', x: 4, y: 6 },
          { id: '2', letter: 'Z', x: 5, y: 6 }
        ],
        rack:  [ { id: '3', letter: 'J', x: 0 } ]
      });
      const action = {
        type: PLACE_TILE,
        tile: {
          id: '1',
          location: 'rack'
        }
      };
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(fromJS({
        board: [ { id: '2', letter: 'Z', x: 5, y: 6 } ],
        rack:  [ { id: '3', letter: 'J', x: 0 }, { id: '1', letter: 'A', x: 1 } ]
      }));
    });

    // This is a major pain to implement, for relatively small gains.
    // Not too concerned.
    xit('handles PLACE_TILE from board to rack, with a specified `x`', () => {
      const state = fromJS({
        board: [ { id: '1', letter: 'O', x: 4, y: 6 } ],
        rack:  [
          { id: '2', letter: 'J', x: 0 },
          { id: '3', letter: 'S', x: 1 },
          { id: '4', letter: 'H', x: 2 }
        ]
      });
      const action = {
        type: PLACE_TILE,
        tile: {
          id: '1',
          location: 'rack',
          x: 1
        }
      };
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(fromJS({
        board: [ { id: '2', letter: 'Z', x: 5, y: 6 } ],
        rack:  [
          { id: '2', letter: 'J', x: 0 },
          { id: '1', letter: 'O', x: 1 },
          { id: '3', letter: 'S', x: 2 },
          { id: '4', letter: 'H', x: 3 }
        ]
      }));
    });

    it('handles PLACE_TILE from board to board', () => {
      const state = fromJS({
        board: [
          { id: '1', letter: 'O', x: 4, y: 6 },
          { id: '2', letter: 'J', x: 5, y: 6 },
        ],
        rack: []
      });
      const action = {
        type: PLACE_TILE,
        tile: {
          id: '2',
          location: 'board',
          x: 8,
          y: 8
        }
      };
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(fromJS({
        board: [
          { id: '1', letter: 'O', x: 4, y: 6 },
          { id: '2', letter: 'J', x: 8, y: 8 },
        ],
        rack: []
      }));
    });
  });



  describe('SHUFFLE_RACK', () => {
    it('copies the new tile ordering to the rack', () => {
      const state = fromJS({
        rack: [ { id: '2', x: 0}, { id: '5', x: 1 } ]
      });
      const action = {
        type: SHUFFLE_RACK,
        tiles: [ { id: '5', x: 1}, { id: '2', x: 0 } ]
      }
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(fromJS({
        rack: [ { id: '5', x: 0}, { id: '2', x: 1 } ]
      }));
    });
  });



  describe('RECALL_TILES_TO_RACK', () => {
    it('brings all non-established board tiles to the rack', () => {
      const state = fromJS({
        board: [
          { letter: 'B', x: 4, y: 7 },
          { letter: 'C', x: 5, y: 7 },
          { letter: 'D', x: 6, y: 7 },
          { letter: 'Z', x: 2, y: 2, turnId: 0 }
        ],
        rack: [
          { letter: 'A', x: 0 }
        ]
      });
      const action = {
        type: RECALL_TILES_TO_RACK
      };
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(fromJS({
        board: [ { letter: 'Z', x: 2, y: 2, turnId: 0 } ],
        rack: [
          { letter: 'A', x: 0 },
          { letter: 'B', x: 1 },
          { letter: 'C', x: 2 },
          { letter: 'D', x: 3 }
        ]
      }));
    });
  });
});
