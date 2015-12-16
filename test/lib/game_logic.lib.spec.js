import { expect } from 'chai';
import * as _     from 'lodash';

import {
  findTile,
  findActiveAxis,
  rewindAndCaptureWord
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
    it('returns `undefined` if there is no tile at those coordinates', () => {
      let board = [
        { letter: 'W', x: 4, y: 7},
        { letter: 'O', x: 4, y: 8},
        { letter: 'O', x: 4, y: 9}
      ];
      let tileResult = findTile(4, 10, board);

      expect(tileResult).to.equal(undefined);

    });
    it('returns `undefined` if we pass in negative coordinates', () => {
      let board = [
        { letter: 'W', x: 4, y: 7},
        { letter: 'O', x: 4, y: 8},
        { letter: 'O', x: 4, y: 9}
      ];
      let tileResult = findTile(-4, 7, board);

      expect(tileResult).to.equal(undefined);

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

    context('when only 1 new tile is on the board', () => {
      xit('returns `x` when the tile extends a horizontal word');
      xit('returns `y` when the tile extends a vertical word');
      xit('returns `x` when the tile extends both');
    });
  });

  describe('#rewindAndCaptureWord', () => {
    it('returns the input tiles when there are no relevant additional tiles', () => {
      let tiles = [
        { letter: 'H', x: 5, y: 5 },
        { letter: 'I', x: 6, y: 5 }
      ];
      let board = [
        { letter: 'H', x: 5, y: 5 },
        { letter: 'I', x: 6, y: 5 },
        { letter: 'Z', x: 8, y: 8, turnId: 'irrelevant'}
      ];
      let activeAxis = findActiveAxis(board);

      let capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal(tiles);
    });

    it('attaches previous letters on the `x` axis', () => {
      let tiles = [
        { letter: 'H', x: 5, y: 5 },
        { letter: 'I', x: 6, y: 5 }
      ];
      let board = [
        { letter: 'P', x: 5, y: 5, turnId: '123' },
        { letter: 'H', x: 6, y: 5 },
        { letter: 'I', x: 7, y: 5 },
        { letter: 'Z', x: 8, y: 8, turnId: 'irrelevant'}
      ];
      let activeAxis = findActiveAxis(board);

      let capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( rewindAndCaptureWord(board) ).to.deep.equal([
        { letter: 'P', x: 5, y: 5, turnId: '123' },
        { letter: 'H', x: 6, y: 5 },
        { letter: 'I', x: 7, y: 5 }
      ]);
    })
  });
});