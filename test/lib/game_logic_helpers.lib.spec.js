import { expect } from 'chai';
import _          from 'lodash';

import {
  isTentative,
  isEstablished,
  findTile,
  findBonusSquare,
  findTentativeTiles,
  findNeighbouringTiles,
  findActiveAxis,
  rewindAndCaptureWord,
  isFirstTurn,
  pruneBonuses,
  getBonusMultiplier,
  applyBonuses
} from '../../common/lib/game_logic.lib';


describe('Game Logic Helpers', () => {
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

    it('returns the correct tile and index', () => {
      const board = [
        { letter: 'W', x: 4, y: 7},
        { letter: 'O', x: 4, y: 8},
        { letter: 'O', x: 4, y: 9}
      ];
      const tileResult = findTile({x: 4, y: 8}, board);

      expect(tileResult).to.deep.equal({ letter: 'O', x: 4, y: 8});
    });
  });



  describe('#findBonusSquare', () => {
    it('returns `undefined` if there is no bonus at those coords', () => {
      const board = [ { letter: 'O', x: 4, y: 4 } ];
      const bonuses = [ { x: 6, y: 6 } ];

      const bonus = findBonusSquare(board[0], bonuses);
      expect(bonus).to.equal(undefined)
    });

    it('returns `undefined` if we do not supply bonuses', () => {
      const board = [ { letter: 'O', x: 4, y: 4 } ];
      const bonuses = [ { x: 4, y: 4 } ];

      const bonus = findBonusSquare(board[0]);
      expect(bonus).to.equal(undefined)
    });

    it('finds the corresponding bonus with the right coordinates', () => {
      const board = [ { letter: 'O', x: 4, y: 4 } ];
      const bonuses = [ { x: 4, y: 4 } ];

      const bonus = findBonusSquare(board[0], bonuses);
      expect(bonus).to.equal(bonuses[0])
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
        { id: 0, letter: 'H', x: 5, y: 5 },
        { id: 1, letter: 'I', x: 6, y: 5 },
        { id: 2, letter: 'Z', x: 8, y: 8, turnId: 'irrelevant'}
      ];
      const tiles = findTentativeTiles(board);
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal(tiles);
    });

    it('attaches previous letters on the `x` axis', () => {
      const board = [
        { id: 0, letter: 'P', x: 5, y: 5, turnId: 1 },
        { id: 1, letter: 'H', x: 6, y: 5 },
        { id: 2, letter: 'I', x: 7, y: 5 },
        { id: 3, letter: 'Z', x: 8, y: 8, turnId: 0}
      ];
      const tiles = findTentativeTiles(board);
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal([
        { id: 0, letter: 'P', x: 5, y: 5, turnId: 1 },
        { id: 1, letter: 'H', x: 6, y: 5 },
        { id: 2, letter: 'I', x: 7, y: 5 }
      ]);
    });

    it('attaches previous letters on the `y` axis', () => {
      const board = [
        { id: 0, letter: 'P', x: 5, y: 5, turnId: 0 },
        { id: 1, letter: 'H', x: 5, y: 6 },
        { id: 2, letter: 'I', x: 5, y: 7 },
        { id: 3, letter: 'Z', x: 5, y: 9, turnId: 0}
      ];
      const tiles = findTentativeTiles(board);
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal([
        { id: 0, letter: 'P', x: 5, y: 5, turnId: 0 },
        { id: 1, letter: 'H', x: 5, y: 6 },
        { id: 2, letter: 'I', x: 5, y: 7 },
      ]);
    });

    it('attaches interspersed and subsequent letters', () => {
      const board = [
        { id: 0, letter: 'T', x: 5, y: 5 },
        { id: 1, letter: 'H', x: 6, y: 5, turnId: 0 },
        { id: 2, letter: 'I', x: 7, y: 5 },
        { id: 3, letter: 'N', x: 8, y: 5, turnId: 0 },
        { id: 4, letter: 'G', x: 9, y: 5, turnId: 0 }
      ];
      const tiles = findTentativeTiles(board);
      const activeAxis = findActiveAxis(board);

      const capturedWord = rewindAndCaptureWord({tiles, board, activeAxis});

      expect( capturedWord ).to.deep.equal(board);
    });

    it('captures the word when only a single new tile is added', () => {
      const board = [
        { id: 0, letter: 'B', x: 6, y: 5, turnId: 0 },
        { id: 1, letter: 'I', x: 7, y: 5, turnId: 0 },
        { id: 2, letter: 'N', x: 8, y: 5, turnId: 0 },
        { id: 3, letter: 'G', x: 9, y: 5 }
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
        { id: 0, letter: 'A', x: 1,  y: 1, turnId: 0 },
        { id: 1, letter: 'L', x: 2,  y: 1 },
        { id: 2, letter: 'L', x: 3,  y: 1 },
        { id: 3, letter: 'T', x: 6,  y: 1, turnId: 0 },
        { id: 4, letter: 'I', x: 7,  y: 1 },
        { id: 5, letter: 'L', x: 8,  y: 1, turnId: 0 },
        { id: 6, letter: 'E', x: 9,  y: 1, turnId: 0 },
        { id: 7, letter: 'S', x: 10, y: 1, turnId: 0 }
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

  describe('#pruneBonuses', () => {
    it('does not touch a list including no word bonus', () => {
      const bonuses = [
        { effect: { tileMultiplier: 2 } },
        { effect: { tileMultiplier: 3 } },
        { effect: { tileMultiplier: 2 } }
      ];
      const prunedBonuses = pruneBonuses(bonuses);

      expect(prunedBonuses).to.deep.equal(bonuses);
    });

    it('does not touch a list including only 1 word bonus', () => {
      const bonuses = [
        { effect: { tileMultiplier: 2 } },
        { effect: { tileMultiplier: 3 } },
        { effect: { tileMultiplier: 2 } },
        { effect: { wordMultiplier: 2 } }
      ];
      const prunedBonuses = pruneBonuses(bonuses);

      expect(prunedBonuses).to.deep.equal(bonuses);
    });

    it('removes one of two identical word bonuses', () => {
      const bonuses = [
        { effect: { tileMultiplier: 2 } },
        { effect: { tileMultiplier: 3 } },
        { effect: { wordMultiplier: 2 } },
        { effect: { wordMultiplier: 2 } }
      ];
      const prunedBonuses = pruneBonuses(bonuses);

      expect(prunedBonuses).to.deep.equal(bonuses.slice(0, 3));
    });

    it('takes the higher option, when duplicates are found', () => {
      const bonuses = [
        { effect: { tileMultiplier: 2 } },
        { effect: { tileMultiplier: 3 } },
        { effect: { wordMultiplier: 2 } },
        { effect: { wordMultiplier: 3 } }   // <--
      ];
      const prunedBonuses = pruneBonuses(bonuses);

      // Keep the first two, and the last one
      const expectedBonuses = [ bonuses[0], bonuses[1], bonuses[3] ];
      expect(prunedBonuses).to.deep.equal(expectedBonuses);
    });

    it('takes the higher option, when the higher value is seen first', () => {
      const bonuses = [
        { effect: { tileMultiplier: 2 } },
        { effect: { wordMultiplier: 3 } },  // <--
        { effect: { tileMultiplier: 3 } },
        { effect: { wordMultiplier: 2 } }
      ];
      const prunedBonuses = pruneBonuses(bonuses);

      const expectedBonuses = [ bonuses[0], bonuses[2], bonuses[1] ];
      expect(prunedBonuses).to.deep.equal(expectedBonuses);
    });

    it('removes multiple duplicates', () => {
      const bonuses = [
        { effect: { wordMultiplier: 2 } },
        { effect: { wordMultiplier: 3 } },
        { effect: { wordMultiplier: 2 } },
        { effect: { wordMultiplier: 3 } }
      ];
      const prunedBonuses = pruneBonuses(bonuses);

      expect(prunedBonuses).to.deep.equal([ bonuses[1] ]);
    });

    it('keeps the highest word multiplier with an additional effect', () => {
      const bonuses = [
        { effect: { tileMultiplier: 2 } },
        { effect: { wordMultiplier: 3 } },
        { effect: {
          wordMultiplier: 2,
          tileMultiplier: 3
        } }
      ];

      // The idea here is that even though the second bonus has a 3x word
      // multiplier, we're taking the third option (with only a 2x multiplier)
      // because it has an additional effect (a tile multiplier as well).
      const prunedBonuses = pruneBonuses(bonuses);

      expect(prunedBonuses).to.deep.equal([ bonuses[0], bonuses[2] ]);
    });
  });

  describe('#getBonusMultiplier', () => {
    it('returns 1 when no bonus is provided', () => {
      expect( getBonusMultiplier(null, 'wordMultiplier') ).to.equal(1);
    });

    it('returns 1 when the bonus has no effect', () => {
      const bonus = {
        label: 'hi there!', x: 3, y: 7
      };

      expect( getBonusMultiplier(bonus, 'wordMultiplier') ).to.equal(1);
    });

    it('returns 1 when the bonus does not have the requested effect', () => {
      const bonus = {
        effect: { tileMultiplier: 2 }
      };

      expect( getBonusMultiplier(bonus, 'wordMultiplier') ).to.equal(1);
    });

    it('returns the value of the effect', () => {
      const bonus = {
        effect: { wordMultiplier: 2 }
      };

      expect( getBonusMultiplier(bonus, 'wordMultiplier') ).to.equal(2);
    });

    it('returns the value of the effect when it has multiple props', () => {
      const bonus = {
        effect: { wordMultiplier: 2, tileMultiplier: 3}
      };

      expect( getBonusMultiplier(bonus, 'tileMultiplier') ).to.equal(3);
    });
  });

  describe('#applyBonuses', () => {
    it('returns the base points value when no bonuses are provided', () => {
      const tiles = [
        { x: 4, y: 4, points: 1 },
        { x: 4, y: 5, points: 1 },
        { x: 4, y: 6, points: 1 }
      ];

      expect( applyBonuses(tiles, []) ).to.equal(1+1+1);
    });

    it('adds in a double letter', () => {
      const tiles = [
        { x: 4, y: 4, points: 3 },
        { x: 4, y: 5, points: 2 },
        { x: 4, y: 6, points: 1 }
      ];
      const bonuses = [
        { x: 4, y: 4, effect: { tileMultiplier: 2 }}
      ];

      const points = applyBonuses(tiles, bonuses);
      expect( points ).to.equal(3*2 + 2 + 1);
    });

    it('adds in a triple letter', () => {
      const tiles = [
        { x: 4, y: 4, points: 3 },
        { x: 4, y: 5, points: 2 },
        { x: 4, y: 6, points: 1 }
      ];
      const bonuses = [
        { x: 4, y: 6, effect: { tileMultiplier: 3 }}
      ];

      const points = applyBonuses(tiles, bonuses);
      expect( points ).to.equal(3 + 2 + 1*3);
    });

    it('adds in a double word', () => {
      const tiles = [
        { x: 4, y: 4, points: 3 },
        { x: 4, y: 5, points: 2 },
        { x: 4, y: 6, points: 1 }
      ];
      const bonuses = [
        { x: 4, y: 6, effect: { wordMultiplier: 2 }}
      ];

      const points = applyBonuses(tiles, bonuses);
      expect( points ).to.equal( (3+2+1) * 2 );
    });

    it('adds in a triple word', () => {
      const tiles = [
        { x: 4, y: 4, points: 3 },
        { x: 4, y: 5, points: 4 },
        { x: 4, y: 6, points: 5 }
      ];
      const bonuses = [
        { x: 4, y: 6, effect: { wordMultiplier: 3 }}
      ];

      const points = applyBonuses(tiles, bonuses);
      expect( points ).to.equal( (3+4+5) * 3 );
    });

    it('doubles a word with a zero tile', () => {
      const tiles = [
        { x: 4, y: 4, points: 0 },
        { x: 4, y: 5, points: 1 },
        { x: 4, y: 6, points: 2 }
      ];
      const bonuses = [
        { x: 4, y: 6, effect: { wordMultiplier: 2 }}
      ];

      const points = applyBonuses(tiles, bonuses);
      expect( points ).to.equal( (0+1+2) * 2 );
    });

    it('handles a double word and a double letter', () => {
      const tiles = [
        { x: 4, y: 4, points: 4 },
        { x: 4, y: 5, points: 3 },
        { x: 4, y: 6, points: 2 }
      ];
      const bonuses = [
        { x: 4, y: 4, effect: { tileMultiplier: 2 }},
        { x: 4, y: 6, effect: { wordMultiplier: 2 }}
      ];

      const points = applyBonuses(tiles, bonuses);
      expect( points ).to.equal( ( (4*2)+3+2) * 2 );
    });

    it('handles multiple letter bonuses and a word bonus', () => {
      const tiles = [
        { x: 4, y: 4, points: 4 },
        { x: 4, y: 5, points: 3 },
        { x: 4, y: 6, points: 2 }
      ];
      const bonuses = [
        { x: 4, y: 4, effect: { tileMultiplier: 2 }},
        { x: 4, y: 5, effect: { tileMultiplier: 3 }},
        { x: 4, y: 6, effect: { wordMultiplier: 3 }}
      ];

      const points = applyBonuses(tiles, bonuses);
      expect( points ).to.equal( ( (4*2)+(3*3)+2 ) * 3 );
    });

    it('picks the highest word bonus when multiple are available', () => {
      const tiles = [
        { x: 4, y: 4, points: 4 },
        { x: 4, y: 5, points: 3 },
        { x: 4, y: 6, points: 2 }
      ];
      const bonuses = [
        { x: 4, y: 4, effect: { wordMultiplier: 2 }},
        { x: 4, y: 5, effect: { tileMultiplier: 3 }},
        { x: 4, y: 6, effect: { wordMultiplier: 3 }}
      ];

      const points = applyBonuses(tiles, bonuses);
      expect( points ).to.equal( ( 4+(3*3)+2 ) * 3 );
    });

    it('handles a single bonus that doubles both letter and word', () => {
      const tiles = [
        { x: 4, y: 4, points: 4 },
        { x: 4, y: 5, points: 3 },
        { x: 4, y: 6, points: 2 }
      ];
      const bonuses = [
        { x: 4, y: 4, effect: {
          wordMultiplier: 3,
          tileMultiplier: 2
        }}
      ];

      const points = applyBonuses(tiles, bonuses);
      expect( points ).to.equal( ( (4*2)+3+2) * 3 );
    });
  });
});
