import { expect } from 'chai';
import * as _     from 'lodash';

import {
  findTile,
  findActiveAxis
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

  describe('#findActiveAxis', () => {
    it('returns false if the tiles span both axes', () => {
      let board = [
        { x: 1, y: 1 },
        { x: 5, y: 5 }
      ];

      expect( findActiveAxis(board) ).to.equal(false);
    });

    it('returns `y` when all the tiles are on the x axis', () => {
      let board = [
        { x: 3, y: 5 },
        { x: 3, y: 6 },
        { x: 3, y: 7 },
        { x: 3, y: 8 }
      ]

      expect( findActiveAxis(board) ).to.equal('y');
    });

    it('returns `x` when all the tiles are on the y axis', () => {
      let board = [
        { x: 1, y: 7 },
        { x: 2, y: 7 },
        { x: 3, y: 7 },
        { x: 4, y: 7 }
      ]

      expect( findActiveAxis(board) ).to.equal('x');
    });
  });
});
