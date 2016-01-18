import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';

import gameReducer, {initialState} from '../../common/reducers/game.reducer';

import {
  PASS_TURN,
  PLACE_TILE,
  RECALL_TILES_TO_RACK,
  SHUFFLE_RACK,
  SUBMIT_WORD,
  TOGGLE_SWAPPING,
  UNSUBSCRIBE_FROM_GAME,
  UPDATE_GAME_STATE
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

  describe('SUBMIT_WORD', () => {
    // TODO
  });

  describe('TOGGLE_SWAPPING', () => {
    it('enables swapping when it was disabled', () => {
      const state = fromJS({
        swap: [],
        isSwapActive: false
      });
      const action = {
        type: TOGGLE_SWAPPING,
      };
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(fromJS({
        swap: [],
        isSwapActive: true
      }));
    });

    it('disables swapping when it was enabled', () => {
      const state = fromJS({
        swap: [
          { id: 1 },
          { id: 2 }
        ],
        isSwapActive: true,
        rack: [
          { id: 3, x: 0 }
        ]
      });
      const action = {
        type: TOGGLE_SWAPPING,
      };
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(fromJS({
        swap: [],
        isSwapActive: false,
        rack: [
          { id: 3, x: 0 },
          { id: 1, x: 1 },
          { id: 2, x: 2 }
        ]
      }));
    });
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



  describe('PASS_TURN', () => {
    it('adds a blank turn to the turns array', () => {
      const state = fromJS({
        players: [
          { id: '123', username: 'Jimbo' },
          { id: '789', username: 'Julia', currentUser: true }
        ],
        turns: [
          { playerId: '123', word: 'YAHOO', points: 25 },
          { playerId: '789', word: 'BOOM', points: 16 },
          { playerId: '123', word: 'ELEPHANT', points: 57 }
        ]
      });
      const action = {
        type: PASS_TURN,
        meta: { remote: '/game' },
        gameId: 1
      };
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(fromJS({
        players: [
          { id: '123', username: 'Jimbo' },
          { id: '789', username: 'Julia', currentUser: true }
        ],
        turns: [
          { playerId: '123', word: 'YAHOO', points: 25 },
          { playerId: '789', word: 'BOOM', points: 16 },
          { playerId: '123', word: 'ELEPHANT', points: 57 },
          { playerId: '789', points: 0, pass: true }
        ]
      }));
    });
  });



  describe('PLACE_TILE', () => {
    it('handles PLACE_TILE from rack to board, rearranges remaining rack', () => {
      const state = fromJS({
        board: [],
        rack: [ {id: '1', letter: 'A', x: 0 }, { id: '2', letter: 'Z', x: 1 } ]
      });
      const action = {
        type: PLACE_TILE,
        tile: {
          id: '1',
          location: 'board',
          x: 2,
          y: 4
        }
      };
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(fromJS({
        board: [ { id: '1', letter: 'A', x: 2, y: 4 } ],
        rack:  [ { id: '2', letter: 'Z', x: 0 } ]
      }));
    });

    it('handles PLACE_TILE from board to rack', () => {
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

    it('handles PLACE_TILE from board to rack, with a specified `x`', () => {
      // The way this works is you drop a board-tile onto a rack-tile, and we
      // pass along a melded tile to the action: the letter/points of the
      // board-tile with the x-coordinate of the rack tile.
      const state = fromJS({
        board: [
          { id: '1', letter: 'O', x: 4, y: 6 },
          { id: '2', letter: 'N', x: 4, y: 7 }
        ],
        rack:  [
          { id: '3', letter: 'S', x: 0 },
          { id: '4', letter: 'A', x: 1 },
          { id: '5', letter: 'P', x: 2 }
        ]
      });
      const action = {
        type: PLACE_TILE,
        tile: {
          id: '2',
          letter: 'N',
          location: 'rack',
          x: 1
        }
      };
      const nextState = gameReducer(state, action);

      expect(nextState).to.equal(fromJS({
        board: [
          { id: '1', letter: 'O', x: 4, y: 6 }
        ],
        rack:  [
          { id: '3', letter: 'S', x: 0 },
          { id: '2', letter: 'N', x: 1 },
          { id: '4', letter: 'A', x: 2 },
          { id: '5', letter: 'P', x: 3 },

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



  describe('UPDATE_GAME_STATE', () => {
    it('updates after an opponent\'s move', () => {
      const state = fromJS({
        board: [
          { id: '1', letter: 'A', x: 1, y: 4, turnId: 0 },
          { id: '2', letter: 'Z', x: 2, y: 4, turnId: 0 }
        ],
        rack: []
      });
    });
  });
});
