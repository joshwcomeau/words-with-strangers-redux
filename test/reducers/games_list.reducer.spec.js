import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';

import
  gamesListReducer, { initialState }
from '../../common/reducers/games_list.reducer';

import {
  ADD_GAMES_TO_LIST,
  GAME_STATUS_CHANGED
}   from '../../common/constants/actions.constants';


describe('gamesListReducer', () => {
  describe('general reducer conditions', () => {
    it('returns input state when an unknown action is provided', () => {
      const state = fromJS([ { game: '123'} ]);
      const action = { type: '123nonsense' };
      const nextState = gamesListReducer(state, action);

      expect(nextState).to.equal(state);
    });

    it('returns default state when none is provided', () => {
      const action = { type: '123nonsense' };
      const nextState = gamesListReducer(undefined, action);

      expect(nextState).to.equal(initialState);
    });
  });

  it('handles ADD_GAMES_TO_LIST', () => {
    const state = fromJS([
      { id: '123', title: 'Wild Folly' },
      { id: '456', title: 'A Fowl Day' }
    ]);
    const action = {
      type: ADD_GAMES_TO_LIST, games: [{ id: '789', title: 'Bird Baths' }]
    };
    const nextState = gamesListReducer(state, action);

    expect(nextState).to.equal(fromJS([
      { id: '123', title: 'Wild Folly' },
      { id: '456', title: 'A Fowl Day' },
      { id: '789', title: 'Bird Baths' }
    ]));
  });

  it('handles GAME_STATUS_CHANGED', () => {
    const state = fromJS([
      { id: '123', title: 'Wild Folly', status: 'waiting' },
      { id: '456', title: 'A Fowl Day', status: 'in_progress' },
      { id: '789', title: 'Bird Baths', status: 'waiting' }
    ]).toOrderedSet();
    const action = {
      type: GAME_STATUS_CHANGED,
      game: { id: '789', title: 'Bird Baths', status: 'in_progress', players: [1,2] }
    };
    const nextState = gamesListReducer(state, action);

    expect(nextState).to.equal(fromJS([
      { id: '123', title: 'Wild Folly', status: 'waiting' },
      { id: '456', title: 'A Fowl Day', status: 'in_progress' },
      { id: '789', title: 'Bird Baths', status: 'in_progress', players: [1,2] }
    ]).toOrderedSet());
  });
});
