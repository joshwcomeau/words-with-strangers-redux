import { expect } from 'chai';
import _          from 'lodash';

import {
  validatePlacement,
  calculatePointsForTurn,
  calculatePointsForWord
} from '../../common/lib/game_logic.lib';


describe('Game Logic', () => {
  // This method consists mostly of helpers tested in game_logic_helpers.
  describe('#validatePlacement', () => {
    it('returns false when tiles are not all on the same axis', () => {
      const board = [
        { id: 0, letter: 'N', x: 2, y: 2 },
        { id: 1, letter: 'O', x: 4, y: 4 }
      ];

      expect( validatePlacement(board) ).to.equal(false);
    });

    it('returns false when there is a gap in the tiles', () => {
      const board = [
        { id: 0, letter: 'N', x: 2, y: 2 },
        { id: 1, letter: 'O', x: 3, y: 2 },
        { id: 2, letter: 'P', x: 5, y: 2 },
        { id: 3, letter: 'E', x: 6, y: 2 }
      ];

      expect( validatePlacement(board) ).to.equal(false);
    });

    it('returns true when a previous turn\'s tile is first', () => {
      const board = [
        { id: 0, letter: 'Y', x: 2, y: 2, turnId: 0 },
        { id: 1, letter: 'E', x: 3, y: 2 },
        { id: 2, letter: 'P', x: 4, y: 2 },
      ];

      expect( validatePlacement(board) ).to.equal(true);
    });

    it('returns true when a previous turn\'s tile is filling a gap', () => {
      const board = [
        { id: 0, letter: 'Y', x: 2, y: 2 },
        { id: 1, letter: 'E', x: 3, y: 2, turnId: 0 },
        { id: 2, letter: 'P', x: 4, y: 2 },
      ];

      expect( validatePlacement(board) ).to.equal(true);
    });

    it('returns true when a previous turn\'s tile is last', () => {
      const board = [
        { id: 0, letter: 'Y', x: 2, y: 2 },
        { id: 1, letter: 'E', x: 3, y: 2 },
        { id: 2, letter: 'P', x: 4, y: 2, turnId: 0 },
      ];

      expect( validatePlacement(board) ).to.equal(true);
    });


    context('on the first turn of the game', () => {
      it('returns true as long as they are in a single connected line', () => {
        const board = [
          { id: 0, letter: 'F', x: 6, y: 4 },
          { id: 1, letter: 'A', x: 6, y: 5 }
        ];

        expect( validatePlacement(board) ).to.equal(true);
      });
    });

    context('not the game\'s first turn', () => {
      it('returns false when the tiles are not connected', () => {
        const board = [
          { id: 0, letter: 'A', x: 2, y: 2, turnId: 0 },
          { id: 1, letter: 'G', x: 4, y: 5 },
          { id: 2, letter: 'H', x: 5, y: 5 }
        ];
        expect( validatePlacement(board) ).to.equal(false);
      });

      it('returns true if there are established tiles within the word', () => {
        const board = [
          { id: 0, letter: 'A', x: 4, y: 4, turnId: 0 },
          { id: 1, letter: 'T', x: 4, y: 5, turnId: 0 },
          { id: 2, letter: 'E', x: 4, y: 6 }
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
          { id: 0, letter: 'G', x: 2, y: 2, turnId: 0 },
          { id: 1, letter: '0', x: 2, y: 1, turnId: 0 },
          { id: 2, letter: 'T', x: 2, y: 0 },
          { id: 3, letter: 'H', x: 3, y: 0 },
          { id: 4, letter: 'E', x: 4, y: 0 }
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
          { id: 0, letter: 'B', x: 2, y: 2, turnId: 0 },
          { id: 1, letter: 'A', x: 2, y: 1, turnId: 0 },
          { id: 2, letter: 'T', x: 3, y: 1 },
          { id: 3, letter: 'O', x: 3, y: 0 }
        ];
        expect( validatePlacement(board) ).to.equal(true);
      });
    });
  });


  describe('#calculatePointsForWord', () => {
    it('sums up the points value of all supplied tiles', () => {
      const tiles = [
        { id: 0, letter: 'O', points: 2 },
        { id: 1, letter: 'B', points: 6, turnId: 0 },
        { id: 2, letter: 'O', points: 2 },
        { id: 3, letter: 'E', points: 1 }
      ];

      expect( calculatePointsForWord(tiles) ).to.equal(11);
    });
  });


  describe('#calculatePointsForTurn', () => {
    it('captures standalone words, on the first turn', () => {
      const board = [
        { id: 0, points: 2, x: 1, y: 1 },
        { id: 1, points: 4, x: 1, y: 2 },
        { id: 2, points: 6, x: 1, y: 3 },
      ];
      const tiles = board;

      expect( calculatePointsForTurn(tiles, board) ).to.equal(12);
    });

    it('captures a vertical orth word that extends in 1 direction', () => {
      /*
        _ h _ _ _
        A I O L I
      */
      const tiles = [
        { id: 0, letter: 'A', points: 2, x: 1, y: 1 },
        { id: 1, letter: 'I', points: 2, x: 2, y: 1 },
        { id: 2, letter: 'O', points: 2, x: 3, y: 1 },
        { id: 3, letter: 'L', points: 2, x: 4, y: 1 },
        { id: 4, letter: 'I', points: 2, x: 5, y: 1 }
      ];
      const board = tiles.concat([
        { id: 5, letter: 'h', points: 6, x: 2, y: 2, turnId: 0 }
     // { id: 1, letter: 'I', points: 2, x: 2, y: 1 } // in `tiles`
      ]);

      expect( calculatePointsForTurn(tiles, board) ).to.equal(10 + 8);
    });

    it('captures a vertical orth word that extends in both directions', () => {
      /*
        _ h _ _ _
        A I O L I
        _ g _ _ _
        _ h _ _ _
      */
      const tiles = [
        { id: 0, letter: 'A', points: 2, x: 1, y: 2 },
        { id: 1, letter: 'I', points: 2, x: 2, y: 2 },
        { id: 2, letter: 'O', points: 2, x: 3, y: 2 },
        { id: 3, letter: 'L', points: 2, x: 4, y: 2 },
        { id: 4, letter: 'I', points: 2, x: 5, y: 2 }
      ];
      const board = tiles.concat([
        { id: 5, letter: 'h', points: 6, x: 2, y: 3, turnId: 0 },
     // { id: 1, letter: 'I', points: 2, x: 2, y: 2 } // in `tiles`
        { id: 6, letter: 'g', points: 4, x: 2, y: 1, turnId: 0 },
        { id: 7, letter: 'h', points: 6, x: 2, y: 0, turnId: 0 }
      ]);

      expect( calculatePointsForTurn(tiles, board) ).to.equal(10 + 18);
    });

    it('perpendicularly adds to a word, no tentative orth words.', () => {
      /*
        _ _ _ t a b
        _ _ _ _ _ 0
        _ _ _ _ _ 0
        _ _ _ _ _ M
      */
      // Because we didn't place the B, we don't get credit for 'TAB'.
      const tiles = [
        { id: 0, letter: 'b', points: 4, x: 5, y: 3, turnId: 0 },
        { id: 1, letter: 'O', points: 2, x: 5, y: 2 },
        { id: 2, letter: 'O', points: 2, x: 5, y: 1 },
        { id: 3, letter: 'M', points: 4, x: 5, y: 0 }
      ];
      const board = tiles.concat([
        { id: 4, letter: 't', points: 2, x: 3, y: 3, turnId: 0 },
        { id: 5, letter: 'a', points: 2, x: 4, y: 3, turnId: 0 },
     // { id: 0, letter: 'b', points: 4, x: 5, y: 3, turnId: 0 }
      ]);

      expect( calculatePointsForTurn(tiles, board) ).to.equal(12 + 0);
    });

    it('runs alongside an existing word, horizontally.', () => {
      /*
        _ _ l a b _
        _ _ O T A _
      */
      // We get credit for our original word OTA, as well as three orthogonal
      // words: LO, AT and BA.
      const tiles = [
        { id: 0, letter: 'O', points: 1, x: 2, y: 0 },
        { id: 1, letter: 'T', points: 1, x: 3, y: 0 },
        { id: 2, letter: 'A', points: 1, x: 4, y: 0 }
      ];
      const board = tiles.concat([
        { id: 3, letter: 'l', points: 2, x: 2, y: 1, turnId: 0 },
        { id: 4, letter: 'a', points: 4, x: 3, y: 1, turnId: 1 },
        { id: 5, letter: 'b', points: 6, x: 4, y: 1, turnId: 1 }
      ]);

      expect( calculatePointsForTurn(tiles, board) ).to.equal(3 + 3 + 5 + 7);
    });

    it('runs alongside an existing word, vertically.', () => {
      /*
        _ r _
        _ o K
        _ p O
      */
      const tiles = [
        { id: 0, letter: 'K', points: 1, x: 2, y: 1 },
        { id: 1, letter: 'O', points: 1, x: 2, y: 0 }
      ];
      const board = tiles.concat([
        { id: 2, letter: 'r', points: 2, x: 1, y: 2, turnId: 0 },
        { id: 3, letter: 'o', points: 4, x: 1, y: 1, turnId: 0 },
        { id: 4, letter: 'p', points: 6, x: 1, y: 0, turnId: 0 }
      ]);

      expect( calculatePointsForTurn(tiles, board) ).to.equal(2 + 5 + 7);
    });


    it('works with a single tentative tile', () => {
      /*
        _ b o a t
        _ a T _ _
        _ t _ _ _
      */
      const tiles = [
        { id: 0, letter: 'a', points: 2,  x: 1, y: 1, turnId: 2 },
        { id: 1, letter: 'T', points: 1, x: 2, y: 1 }
      ];
      const board = tiles.concat([
        { id: 2, letter: 'b', points: 10, x: 1, y: 2, turnId: 4 },
        { id: 3, letter: 'o', points: 2,  x: 2, y: 2, turnId: 4 },
        { id: 4, letter: 'a', points: 2,  x: 3, y: 2, turnId: 4 },
        { id: 5, letter: 't', points: 4,  x: 4, y: 2, turnId: 4 },
     // { id: 0, letter: 'a', points: 2,  x: 1, y: 1, turnId: 2 },
        { id: 6, letter: 't', points: 1,  x: 1, y: 0, turnId: 2 }
      ]);

      expect( calculatePointsForTurn(tiles, board) ).to.equal(3 + 3);
    });

    it('connects to three previous turns', () => {
      /*
        _ b _ _ p _
        _ a _ _ a _
        _ T O S S _
        _ _ _ _ s o
      */
      const tiles = [
        { id: 0, letter: 'T', points: 2, x: 1, y: 1 },
        { id: 1, letter: 'O', points: 1, x: 2, y: 1 },
        { id: 2, letter: 'S', points: 2, x: 3, y: 1 },
        { id: 3, letter: 'S', points: 2, x: 4, y: 1 }
      ];
      const board = tiles.concat([
        { id: 4, letter: 'b', points: 10, x: 1, y: 3, turnId: 0 },
        { id: 5, letter: 'a', points: 2,  x: 1, y: 2, turnId: 0 },
     // { id: 0, letter: 'T', points: 2, x: 1, y: 1 },

        { id: 6, letter: 'p', points: 3,  x: 4, y: 3, turnId: 1 },
        { id: 7, letter: 'a', points: 1,  x: 4, y: 2, turnId: 1 },
        { id: 8, letter: 's', points: 1,  x: 4, y: 0, turnId: 2 },
        { id: 9, letter: 'o', points: 2,  x: 5, y: 0, turnId: 2 }
      ]);

      expect( calculatePointsForTurn(tiles, board) ).to.equal(7 + 14 + 7);
    });

    context('with bonus squares', () => {
      // I'm not going to test this too thoroughly, because individual
      // words with bonuses have already been tested in game_logic_helpers.
      it('factors in a bonus tile multiplier', () => {
        const tiles = [
          { id: 0, letter: 'B', points: 2, x: 1, y: 1 },
          { id: 1, letter: 'O', points: 1, x: 2, y: 1 },
          { id: 2, letter: 'O', points: 2, x: 3, y: 1 },
          { id: 3, letter: 'M', points: 2, x: 4, y: 1 }
        ];
        const board = tiles;
        const bonuses = [
          { x: 1, y: 1, effect: { tileMultiplier: 2 } }
        ]

        const points = calculatePointsForTurn(tiles, board, bonuses);
        expect( points ).to.equal( 2*2 + 1 + 2 + 2 );
      });

      it('factors in a bonus word multiplier', () => {
        const tiles = [
          { id: 0, letter: 'B', points: 2, x: 1, y: 1 },
          { id: 1, letter: 'O', points: 1, x: 2, y: 1 },
          { id: 2, letter: 'O', points: 2, x: 3, y: 1 },
          { id: 3, letter: 'M', points: 2, x: 4, y: 1 }
        ];
        const board = tiles;
        const bonuses = [
          { x: 1, y: 1, effect: { wordMultiplier: 2 } }
        ]

        const points = calculatePointsForTurn(tiles, board, bonuses);
        expect( points ).to.equal( (2 + 1 + 2 + 2) * 2 );
      });

      it('factors in both word and tile bonus multipliers', () => {
        const tiles = [
          { id: 0, letter: 'B', points: 2, x: 1, y: 1 },
          { id: 1, letter: 'O', points: 1, x: 2, y: 1 },
          { id: 2, letter: 'O', points: 2, x: 3, y: 1 },
          { id: 3, letter: 'M', points: 2, x: 4, y: 1 }
        ];
        const board = tiles;
        const bonuses = [
          { x: 1, y: 1, effect: { wordMultiplier: 2 } },
          { x: 2, y: 1, effect: { tileMultiplier: 3 } }
        ]

        const points = calculatePointsForTurn(tiles, board, bonuses);
        expect( points ).to.equal( (2 + 1*3 + 2 + 2) * 2 );
      });

      it('does not re-apply word bonuses on established tiles', () => {
        const tiles = [
          { id: 0, letter: 'B', points: 2, x: 1, y: 1 },
          { id: 1, letter: 'O', points: 1, x: 2, y: 1 },
          { id: 2, letter: 'O', points: 2, x: 3, y: 1 },
          { id: 3, letter: 'm', points: 2, x: 4, y: 1, turnId: 0 }
        ];
        const board = tiles.concat([
       // { id: 3, letter: 'm', points: 2, x: 4, y: 1, turnId: 0 },
          { id: 3, letter: 'e', points: 2, x: 4, y: 2, turnId: 0 }
        ]);
        const bonuses = [
          { x: 4, y: 1, effect: { wordMultiplier: 2 } }
        ]

        const points = calculatePointsForTurn(tiles, board, bonuses);
        expect( points ).to.equal( 2 + 1 + 2 + 2 );
      });

      it('does not re-apply tile bonuses on established tiles', () => {
        const tiles = [
          { id: 0, letter: 'B', points: 2, x: 1, y: 1 },
          { id: 1, letter: 'O', points: 1, x: 2, y: 1 },
          { id: 2, letter: 'O', points: 2, x: 3, y: 1 },
          { id: 3, letter: 'm', points: 2, x: 4, y: 1, turnId: 0 }
        ];
        const board = tiles.concat([
       // { id: 3, letter: 'm', points: 2, x: 4, y: 1, turnId: 0 },
          { id: 3, letter: 'e', points: 2, x: 4, y: 2, turnId: 0 }
        ]);
        const bonuses = [
          { x: 4, y: 1, effect: { tileMultiplier: 2 } }
        ]

        const points = calculatePointsForTurn(tiles, board, bonuses);
        expect( points ).to.equal( 2 + 1 + 2 + 2 );
      });

      it('does not re-apply multi-bonuses on established tiles', () => {
        const tiles = [
          { id: 0, letter: 'B', points: 2, x: 1, y: 1 },
          { id: 1, letter: 'O', points: 1, x: 2, y: 1 },
          { id: 2, letter: 'O', points: 2, x: 3, y: 1 },
          { id: 3, letter: 'm', points: 2, x: 4, y: 1, turnId: 0 }
        ];
        const board = tiles.concat([
       // { id: 3, letter: 'm', points: 2, x: 4, y: 1, turnId: 0 },
          { id: 3, letter: 'e', points: 2, x: 4, y: 2, turnId: 0 }
        ]);
        const bonuses = [
          { x: 4, y: 1, effect: {
            tileMultiplier: 2,
            wordMultiplier: 3
          } }
        ]

        const points = calculatePointsForTurn(tiles, board, bonuses);
        expect( points ).to.equal( 2 + 1 + 2 + 2 );
      });
    });
  });
});
