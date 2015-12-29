import { expect } from 'chai';
import * as _     from 'lodash';

import {
  isTentative,
  isEstablished,
  findTile,
  findTentativeTiles,
  findNeighbouringTiles,
  findActiveAxis,
  rewindAndCaptureWord,
  isFirstTurn,
  validatePlacement
} from '../../common/lib/game_logic.lib';


describe('Game Logic', () => {
  describe('#isTentative', () => {
    it('returns false when not passed a valid tile', () => {
      expect( isTentative(null) ).to.equal(false);
    })
    it('returns false when it has a turn ID', () => {
      const tile = { letter: 'A', turnId: 0 };
      expect( isTentative(tile) ).to.equal(false);
    });
    it('returns true when it does not have a turn ID', () => {
      const tile = { letter: 'A' };
      expect( isTentative(tile) ).to.equal(true);
    });
  });



  describe('#isEstablished', () => {
    it('returns false when not passed a valid tile', () => {
      expect( isEstablished(null) ).to.equal(false);
    })
    it('returns false when it does not have a turn ID', () => {
      const tile = { letter: 'A', turnId: 0 };
      expect( isEstablished(tile) ).to.equal(true);
    });
    it('returns true when it has a turn ID', () => {
      const tile = { letter: 'A' };
      expect( isEstablished(tile) ).to.equal(false);
    });
  });



  describe('#findTile', () => {
    it('returns the correct tile and index', () => {
      const board = [
        { letter: 'W', x: 4, y: 7},
        { letter: 'O', x: 4, y: 8},
        { letter: 'O', x: 4, y: 9}
      ];
      const tileResult = findTile({x: 4, y: 8}, board);

      expect(tileResult).to.deep.equal({ letter: 'O', x: 4, y: 8});

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




  describe('#findTentativeTiles', () => {
    it('returns an empty array on an empty board', () => {
      const board = [];

      expect( findTentativeTiles(board) ).to.deep.equal([]);
    });
    it('returns an empty array on a board with only established tiles', () => {
      const board = [
        { letter: 'E', turnId: 0 }, { letter: 'S', turnId: 0 }, { letter: 'T', turnId: 0 }
      ];

      expect( findTentativeTiles(board) ).to.deep.equal([]);
    });
    it('returns all the tiles on the board if they are all tentative', () => {
      const board = [
        { letter: 'T' }, { letter: 'E' }, { letter: 'N' }, { letter: 'T' }
      ];

      expect( findTentativeTiles(board) ).to.deep.equal(board);
    });
    it('returns only the tentative tiles on a mixed board', () => {
      const board = [
        { letter: 'M'},
        { letter: 'I', turnId: 0 },
        { letter: 'X', turnId: 0 },
        { letter: 'E'},
        { letter: 'D'}
      ];

      expect( findTentativeTiles(board) ).to.deep.equal([
        { letter: 'M'}, { letter: 'E'}, { letter: 'D'}
      ]);
    });
  });



  describe('#findNeighbouringTiles', () => {
    it('returns an empty array when the tile has no neighbours', () => {
      let tile  = { x: 3, y: 3 };
      let board = [ tile ];

      expect( findNeighbouringTiles(tile, board) ).to.deep.equal([]);
    });

    it('returns a single neighbour', () => {
      let tile      = { x: 3, y: 3 };
      let neighbour = { x: 2, y: 3 };
      let board     = [ tile, neighbour ];

      expect( findNeighbouringTiles(tile, board) ).to.deep.equal([neighbour]);
    });

    it('ignores diagonally-touching and faraway tiles', () => {
      let tile      = { x: 3, y: 3 };
      let neighbour = { x: 2, y: 3 };
      let board     = [
        tile, neighbour,
        { x: 2, y: 2 },
        { x: 8, y: 4 }
      ];

      expect( findNeighbouringTiles(tile, board) ).to.deep.equal([neighbour]);
    });

    it('finds all possible neighbours', () => {
      let tile        = { x: 3, y: 3 };
      let neighbours  = [
        { x: 2, y: 3 },
        { x: 3, y: 4 },
        { x: 3, y: 2 },
        { x: 4, y: 3 }
      ];
      let board = [ tile ].concat(neighbours);

      expect( findNeighbouringTiles(tile, board) ).to.deep.equal(neighbours);
    });
  });



  describe('#findActiveAxis', () => {
    it('returns false if the tiles span both axes', () => {
      const board = [ { x: 1, y: 1 }, { x: 5, y: 5 } ];
      expect( findActiveAxis(board) ).to.equal(false);
    });

    it('returns false if there are no tentative tiles on the board', () => {
      const board = [ { x: 1, y: 1, turnId: 0 }, { x: 1, y: 2, turnId: 0 } ];

      expect( findActiveAxis(board) ).to.equal(false);
    })

    it('returns `y` when all the tiles are on the x axis', () => {
      const board = [
        { x: 3, y: 6 },
        { x: 3, y: 7 },
        { x: 3, y: 8 }
      ]

      expect( findActiveAxis(board) ).to.equal('y');
    });

    it('returns `x` when all the tiles are on the y axis', () => {
      const board = [
        { x: 2, y: 7 },
        { x: 3, y: 7 },
        { x: 4, y: 7 }
      ]

      expect( findActiveAxis(board) ).to.equal('x');
    });

    it('ignores tiles from previous turns', () => {
      const board = [
        { x: 2, y: 7 },
        { x: 3, y: 7 },
        { x: 6, y: 9, turnId: 0 }
      ]

      expect( findActiveAxis(board) ).to.equal('x');
    });

    context('when only 1 new tile is on the board', () => {
      it('returns false when it isn\'t connected to existing tiles', () => {
        const board = [
          { x: 1, y: 1, turnId: 0 },
          { x: 1, y: 2, turnId: 0 },
          { x: 6, y: 6 }
        ]

        expect( findActiveAxis(board) ).to.equal(false);
      })
      it('returns `x` when the tile extends a horizontal word', () => {
        const board = [
          { x: 2, y: 7, turnId: 0 },
          { x: 3, y: 7, turnId: 0 },
          { x: 4, y: 7 }
        ]

        expect( findActiveAxis(board) ).to.equal('x');
      });

      it('returns `y` when the tile extends a vertical word', () => {
        const board = [
          { x: 2, y: 3, turnId: 0 },
          { x: 2, y: 4, turnId: 0 },
          { x: 2, y: 5, turnId: 0 },
          { x: 2, y: 6 }
        ]

        expect( findActiveAxis(board) ).to.equal('y');
      });

      it('returns `x` when the tile extends both', () => {
        const board = [
          { x: 1, y: 1, turnId: 0 },
          { x: 1, y: 2, turnId: 0 },
          { x: 2, y: 1, turnId: 0 },
          { x: 2, y: 2 }
        ]

        expect( findActiveAxis(board) ).to.equal('x');
      });

      it('returns `x` when it\'s the first tile on the board', () => {
        const board = [
          { x: 2, y: 2 }
        ]

        expect( findActiveAxis(board) ).to.equal('x');
      });
    });
  });




  describe('#rewindAndCaptureWord', () => {
    it('returns the input tiles when there are no relevant additional tiles', () => {
      const board = [
        { letter: 'H', x: 5, y: 5 },
        { letter: 'I', x: 6, y: 5 },
        { letter: 'Z', x: 8, y: 8, turnId: 'irrelevant'}
      ];
      const tiles = findTentativeTiles(board);
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal(tiles);
    });

    it('attaches previous letters on the `x` axis', () => {
      const board = [
        { letter: 'P', x: 5, y: 5, turnId: 1 },
        { letter: 'H', x: 6, y: 5 },
        { letter: 'I', x: 7, y: 5 },
        { letter: 'Z', x: 8, y: 8, turnId: 0}
      ];
      const tiles = findTentativeTiles(board);
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal([
        { letter: 'P', x: 5, y: 5, turnId: 1 },
        { letter: 'H', x: 6, y: 5 },
        { letter: 'I', x: 7, y: 5 }
      ]);
    });

    it('attaches previous letters on the `y` axis', () => {
      const board = [
        { letter: 'P', x: 5, y: 5, turnId: 0 },
        { letter: 'H', x: 5, y: 6 },
        { letter: 'I', x: 5, y: 7 },
        { letter: 'Z', x: 5, y: 9, turnId: 0}
      ];
      const tiles = findTentativeTiles(board);
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal([
        { letter: 'P', x: 5, y: 5, turnId: 0 },
        { letter: 'H', x: 5, y: 6 },
        { letter: 'I', x: 5, y: 7 },
      ]);
    });

    it('attaches interspersed and subsequent letters', () => {
      const board = [
        { letter: 'T', x: 5, y: 5 },
        { letter: 'H', x: 6, y: 5, turnId: 0 },
        { letter: 'I', x: 7, y: 5 },
        { letter: 'N', x: 8, y: 5, turnId: 0 },
        { letter: 'G', x: 9, y: 5, turnId: 0 }
      ];
      const tiles = findTentativeTiles(board);
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal(board);
    });

    it('captures the word when only a single new tile is added', () => {
      const board = [
        { letter: 'B', x: 6, y: 5, turnId: 0 },
        { letter: 'I', x: 7, y: 5, turnId: 0 },
        { letter: 'N', x: 8, y: 5, turnId: 0 },
        { letter: 'G', x: 9, y: 5 }
      ];
      const tiles = findTentativeTiles(board);
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal(board);
    });

    it('returns null when there are gaps in the tiles', () => {
      // Consider this board:
      // _ A _ _ _ _ T _ L E S _

      // We place 3 tiles:
      // _ A L L _ _ T I L E S _
      //     * *       *

      // We want to make sure we return null, and not either of the words.
      const board = [
        { letter: 'A', x: 1,  y: 1, turnId: 0 },
        { letter: 'L', x: 2,  y: 1 },
        { letter: 'L', x: 3,  y: 1 },
        { letter: 'T', x: 6,  y: 1, turnId: 0 },
        { letter: 'I', x: 7,  y: 1 },
        { letter: 'L', x: 8,  y: 1, turnId: 0 },
        { letter: 'E', x: 9,  y: 1, turnId: 0 },
        { letter: 'S', x: 10, y: 1, turnId: 0 }
      ];
      const tiles = findTentativeTiles(board);
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect(capturedWord).to.equal(null);
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



  // This method is really just the combination of 3 previously-tested methods
  // Tests will be pretty brief because this is mostly redundant.
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

      expect( validatePlacement(board) ).to.equal(true);
    });

    it('returns true when a previous turn\'s tile is filling a gap', () => {
      const board = [
        { letter: 'Y', x: 2, y: 2 },
        { letter: 'E', x: 3, y: 2, turnId: 0 },
        { letter: 'P', x: 4, y: 2 },
      ];

      expect( validatePlacement(board) ).to.equal(true);
    });

    it('returns true when a previous turn\'s tile is last', () => {
      const board = [
        { letter: 'Y', x: 2, y: 2 },
        { letter: 'E', x: 3, y: 2 },
        { letter: 'P', x: 4, y: 2, turnId: 0 },
      ];

      expect( validatePlacement(board) ).to.equal(true);
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

      it('returns true if there are established tiles within the word', () => {
        const board = [
          { letter: 'A', x: 4, y: 4, turnId: 0 },
          { letter: 'T', x: 4, y: 5, turnId: 0 },
          { letter: 'E', x: 4, y: 6 }
        ];
        expect( validatePlacement(board) ).to.equal(true);
      });

      it('returns true if there is a perpendicular orthogonal word', () => {
        /* eg:
        _ _ G _ _ < Established 'G'
        _ _ O _ _ < Established 'O'
        _ _ T H E < Tentative 'THE'
        */
        const board = [
          { letter: 'G', x: 2, y: 2, turnId: 0 },
          { letter: '0', x: 2, y: 1, turnId: 0 },
          { letter: 'T', x: 2, y: 0 },
          { letter: 'H', x: 3, y: 0 },
          { letter: 'E', x: 4, y: 0 }
        ];
        expect( validatePlacement(board) ).to.equal(true);
      });

      it('returns true if there is a parallel orthogonal word', () => {
        /* eg:
        _ _ B _ _ < Established 'B'
        _ _ A T _ < Established 'A', tentative 'T'
        _ _ _ O _ < Tentative '0'
        */
        const board = [
          { letter: 'B', x: 2, y: 2, turnId: 0 },
          { letter: 'A', x: 2, y: 1, turnId: 0 },
          { letter: 'T', x: 3, y: 1 },
          { letter: 'O', x: 3, y: 0 }
        ];
        expect( validatePlacement(board) ).to.equal(true);
      });
    });


  });
});
