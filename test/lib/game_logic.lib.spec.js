import { expect } from 'chai';
import * as _     from 'lodash';

import {
  findTile
} from '../../common/lib/game_logic.lib';

describe('Game Logic', () => {
  describe('#findTile', () => {
    it('returns the correct tile and index', () => {
      let board = [
        { letter: 'W', x: 4, y: 7},
        { letter: 'O', x: 4, y: 8},
        { letter: 'O', x: 4, y: 9}
      ];
      let tileResult = findTile(4, 8, board);

      expect(tileResult).to.deep.equal([
        { letter: 'O', x: 4, y: 8},
        1
      ]);

    });
  });
});
