import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';
import * as _                 from 'lodash';


import gameSelector, {
  calculateCurrentTurnPlayer,
  isMyTurn
} from '../../common/selectors/game.selector';



describe('Game Selector', () => {
  describe('#calculateCurrentTurnPlayer', () => {
    const creator = { name: 'Josh',    id: 4 };
    const player2 = { name: 'Dorothy', id: 2 };
    const player3 = { name: 'Janice',  id: 8 };
    const players = [ creator, player2, player3 ];

    it('returns the first player when there are no turns', () => {
      const turns = [];
      expect( calculateCurrentTurnPlayer(turns, players) ).to.equal(creator);
    });

    it('returns the second player when there is 1 turn', () => {
      const turns = [ { word: 'BOOM'} ];
      expect( calculateCurrentTurnPlayer(turns, players) ).to.equal(player2);
    });

    it('returns the third player when there are 5 turn', () => {
      const turns = [
        { word: 'I'},
        { word: 'THINK'},
        { word: 'THIS'},
        { word: 'WILL'},
        { word: 'WORK'}
      ];
      expect( calculateCurrentTurnPlayer(turns, players) ).to.equal(player3);
    });
  });

  describe('#isMyTurn', () => {
    const me  = { name: 'Josh', currentUser: true };
    const him = { name: 'Hansel' };
    const her = { name: 'Gretel' };
    const players = [ him, her, me ];

    it('returns false when it is not my turn', () => {
      const turns = [ { word: 'GERMAN' } ];
      expect( isMyTurn(turns, players) ).to.equal(false);
    });

    it('returns true when it is my turn', () => {
      const turns = [ { word: 'GERMAN' }, { word: 'SAUSAGE' } ];
      expect( isMyTurn(turns, players) ).to.equal(true);
    });
  });
});
