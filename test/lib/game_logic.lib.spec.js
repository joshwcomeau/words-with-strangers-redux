import { expect } from 'chai';
import * as _     from 'lodash';

import {
  findTile,
  findActiveAxis,
  rewindAndCaptureWord,
  isFirstTurn,
  validatePlacement
} from '../../common/lib/game_logic.lib';


describe('Game Logic', () => {
  describe('#findTile', () => {
    it('returns the correct tile and index', () => {
      const board = [
        { letter: 'W', x: 4, y: 7},
        { letter: 'O', x: 4, y: 8},
        { letter: 'O', x: 4, y: 9}
      ];
      const tileResult = findTile({x: 4, y: 8}, board);

      expect(tileResult).to.deep.equal([
        { letter: 'O', x: 4, y: 8},
        1
      ]);

    });
    it('returns `undefined` if there is no tile at those coordinates', () => {
      const board = [
        { letter: 'W', x: 4, y: 7},
        { letter: 'O', x: 4, y: 8},
        { letter: 'O', x: 4, y: 9}
      ];
      const tileResult = findTile(4, 10, board);

      expect(tileResult).to.equal(undefined);

    });
    it('returns `undefined` if we pass in negative coordinates', () => {
      const board = [
        { letter: 'W', x: 4, y: 7},
        { letter: 'O', x: 4, y: 8},
        { letter: 'O', x: 4, y: 9}
      ];
      const tileResult = findTile(-4, 7, board);

      expect(tileResult).to.equal(undefined);

    });
  });

  describe('#findActiveAxis', () => {
    it('returns false if the tiles span both axes', () => {
      const board = [
        { x: 1, y: 1 },
        { x: 5, y: 5 }
      ];

      expect( findActiveAxis(board) ).to.equal(false);
    });

    it('returns `y` when all the tiles are on the x axis', () => {
      const board = [
        { x: 3, y: 5 },
        { x: 3, y: 6 },
        { x: 3, y: 7 },
        { x: 3, y: 8 }
      ]

      expect( findActiveAxis(board) ).to.equal('y');
    });

    it('returns `x` when all the tiles are on the y axis', () => {
      const board = [
        { x: 1, y: 7 },
        { x: 2, y: 7 },
        { x: 3, y: 7 },
        { x: 4, y: 7 }
      ]

      expect( findActiveAxis(board) ).to.equal('x');
    });

    it('ignores tiles from previous turns', () => {
      const board = [
        { x: 1, y: 7 },
        { x: 2, y: 7 },
        { x: 3, y: 7 },
        { x: 6, y: 9, turnId: '123' }
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
      const tiles = [
        { letter: 'H', x: 5, y: 5 },
        { letter: 'I', x: 6, y: 5 }
      ];
      const board = [
        { letter: 'H', x: 5, y: 5 },
        { letter: 'I', x: 6, y: 5 },
        { letter: 'Z', x: 8, y: 8, turnId: 'irrelevant'}
      ];
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal(tiles);
    });

    it('attaches previous letters on the `x` axis', () => {
      const tiles = [
        { letter: 'H', x: 6, y: 5 },
        { letter: 'I', x: 7, y: 5 },
      ];
      const board = [
        { letter: 'P', x: 5, y: 5, turnId: '123' },
        { letter: 'H', x: 6, y: 5 },
        { letter: 'I', x: 7, y: 5 },
        { letter: 'Z', x: 8, y: 8, turnId: 'irrelevant'}
      ];
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal([
        { letter: 'P', x: 5, y: 5, turnId: '123' },
        { letter: 'H', x: 6, y: 5 },
        { letter: 'I', x: 7, y: 5 }
      ]);
    });

    it('attaches previous letters on the `y` axis', () => {
      const tiles = [
        { letter: 'H', x: 5, y: 6 },
        { letter: 'I', x: 5, y: 7 },
      ];
      const board = [
        { letter: 'P', x: 5, y: 5, turnId: '123' },
        { letter: 'H', x: 5, y: 6 },
        { letter: 'I', x: 5, y: 7 },
        { letter: 'Z', x: 5, y: 9, turnId: 'irrelevant'}
      ];
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal([
        { letter: 'P', x: 5, y: 5, turnId: '123' },
        { letter: 'H', x: 5, y: 6 },
        { letter: 'I', x: 5, y: 7 },
      ]);
    });

    it('attaches interspersed and subsequent letters', () => {
      const tiles = [
        { letter: 'T', x: 6, y: 5 },
        { letter: 'I', x: 7, y: 5 },
      ];
      const board = [
        { letter: 'T', x: 5, y: 5 },
        { letter: 'H', x: 6, y: 5, turnId: '123' },
        { letter: 'I', x: 7, y: 5 },
        { letter: 'N', x: 8, y: 5, turnId: '123'},
        { letter: 'G', x: 9, y: 5, turnId: '123'}
      ];
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal([
        { letter: 'T', x: 5, y: 5 },
        { letter: 'H', x: 6, y: 5, turnId: '123' },
        { letter: 'I', x: 7, y: 5 },
        { letter: 'N', x: 8, y: 5, turnId: '123' },
        { letter: 'G', x: 9, y: 5, turnId: '123' }
      ]);
    });
  });

  describe('#isFirstTurn', () => {
    it('returns true when the board is empty', () => {
      const board = [];
      expect( isFirstTurn(board) ).to.equal(true);
    });

    it('returns true when the board has no previously-placed tiles', () => {
      const board = [
        { letter: 'N' },
        { letter: 'E' },
        { letter: 'W' }
      ];
      expect( isFirstTurn(board) ).to.equal(true);
    });

    it('returns false when the board has previously-placed tiles', () => {
      const board = [
        { letter: 'N' },
        { letter: 'E' },
        { letter: 'W' },
        { letter: 'O', turnId: 0 }
      ];
      expect( isFirstTurn(board) ).to.equal(false);
    });
  });

  describe('#validatePlacement', () => {
    it('returns false when tiles are not all on the same axis', () => {
      const board = [
        { letter: 'N', x: 2, y: 2 },
        { letter: 'O', x: 4, y: 4 }
      ];

      expect( validatePlacement(board) ).to.equal(false);
    });

    it('returns false when there is a gap in the tiles', () => {
      const board = [
        { letter: 'N', x: 2, y: 2 },
        { letter: 'O', x: 3, y: 2 },
        { letter: 'P', x: 5, y: 2 },
        { letter: 'E', x: 6, y: 2 }
      ];

      expect( validatePlacement(board) ).to.equal(false);
    });

    it('returns true when a previous turn\'s tile is first', () => {
      const board = [
        { letter: 'Y', x: 2, y: 2, turnId: 0 },
        { letter: 'E', x: 3, y: 2 },
        { letter: 'P', x: 4, y: 2 },
      ];
    });

    it('returns true when a previous turn\'s tile is filling a gap', () => {
      const board = [
        { letter: 'Y', x: 2, y: 2 },
        { letter: 'E', x: 3, y: 2, turnId: 0 },
        { letter: 'P', x: 4, y: 2 },
      ];
    });

    it('returns true when a previous turn\'s tile is last', () => {
      const board = [
        { letter: 'Y', x: 2, y: 2 },
        { letter: 'E', x: 3, y: 2 },
        { letter: 'P', x: 4, y: 2, turnId: 0 },
      ];
    });


    context('on the first turn of the game', () => {
      it('returns true as long as they are in a single connected line', () => {
        const board = [
          { letter: 'F', x: 6, y: 4 },
          { letter: 'A', x: 6, y: 5 }
        ];

        expect( validatePlacement(board) ).to.equal(true);
      });
    });

    context('not the game\'s first turn', () => {
      it('returns false when the tiles are not connected', () => {
        const board = [
          { letter: 'A', x: 2, y: 2, turnId: 0 },
          { letter: 'G', x: 4, y: 5 },
          { letter: 'H', x: 5, y: 5 }
        ];
        expect( validatePlacement(board) ).to.equal(false);
      });
    });


  });
});
