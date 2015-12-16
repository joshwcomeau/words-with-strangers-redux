import * as _ from 'lodash';
import { BOARD_SIZE } from '../constants/config.constants.js';

export function getPlacedWord(board) {
  // Looks at the supplied `board` object (a plain-JS array of Tile objects)
  // and plucks out the ones that spell the word. Orders them.
  // If the placed tiles do not equal a word (not all in 1 horizontal/vertical
  // line, or with spaces between them), returns null.

  // 1. Figure out which tiles belong to this turn.
  let newTiles = _.filter(board, tile => typeof tile.turnId === 'undefined');

  // 2. Figure out which axis we're working in, either horizontal or vertical.
  let activeAxis = findActiveAxis(newTiles);
  let inactiveAxis = activeAxis === 'x' ? 'y' : 'x';

  // 3. Find any other letters that are involved in our primary word.
  // We know which letters are ours, and we know which axis we're on.
  // We don't know, though, if our letters make up the whole word.
  //
  // For example, imagine this:
  // _ _ _ F R E E _ _ _ _
  // We come along, and add 3 letters:
  // _ _ _ F R E E D O M _
  //               ^ ^ ^
  // In this case, new tiles are 'DOM', but that's not the whole story!
  //
  // The solution to this problem is to 'rewind' to the earliest letter
  // in the sequence, and then move forward through all the letters.
  let allTilesInWord = rewindAndCaptureWord({ activeAxis, newTiles });
}







// HELPER FUNCTIONS
// Exposed primarily so they can be tested, although they're generic enough
// that they can be called from the outside if they really want to be.

// Given X/Y coordinates, fetch a tile!
// RETURNS: An array [ tileObject, tileObjectIndex ]
export function findTile(x, y, board) {
  console.log("Looking for", x, y, board)
  let tileIndex = _.findIndex( board, tile => (tile.x === x && tile.y === y) );

  if ( tileIndex === -1 ) return undefined;

  return [ board[tileIndex], tileIndex ];
}

// Figure out whether the tiles form a horizontal or vertical line.
// RETURNS: either:
//   - a String (enum: ['x', 'y']) if the move is valid, or
//   - a Boolean (false) if the move is invalid.
export function findActiveAxis(tiles) {
  const deltaX = getDeltaOfAxis(tiles, 'x');
  const deltaY = getDeltaOfAxis(tiles, 'y');

  // If all the tiles are on the same row/column, the delta for that axis
  // will be zero. If both axes are more than zero, it means we have tiles
  // that aren't neatly in a single row or column.
  if ( deltaX && deltaY ) return false;

  return deltaX ? 'x' : 'y';

}

// Figure out how many tiles apart the highest/lowest tile are, on a given axis
// RETURNS: An integer
function getDeltaOfAxis(tiles, axis) {
  const axisPoints = tiles.map( tile => tile[axis]).sort();
  return _.last(axisPoints) - _.first(axisPoints);
}


// RETURNS: An array of Tile objects.
function rewindAndCaptureWord({ activeAxis, tiles: tiles, board}) {
  // The idea here is I have a sequence of tiles on an axis, and I need
  // to find any missing tiles to fulfill the word.
  // Imagine this row:
  // _ C * E E * _ _
  // We have C, E and E in non-sequence, and the board has 2 letters
  // from a previous round. Our job is to find all letters in this word,
  // and return an array of the Tile objects.

  // VARIABLES
  let wordTiles = [];       // our returned list of Tiles
  let cursorTile;           // A track-keeping tile that we use for navigation.
  let earliestTile;         // The earliest tile we've seen. The start of the word.
  let inactiveAxis;         // String. 'x' or 'y'. Opposite of 'axis'.
  let inactiveAxisPosition  // integer. Holds the static axis position.
  let tileObject;           // Holds a Mongo query to find a specific tile


  // First, find the earliest letter.
  earliestTile = _.first( _.sortBy(tiles, tile => tile[activeAxis]) );

  // Create a cursor tile that will traverse back away from the earliest
  // letter. It's called a cursor simply because it moves along a row.
  cursorTile = earliestTile;

  // Since our inactive axis never changes, let's just store it now.
  inactiveAxis = activeAxis !== 'x' ? 'x' : 'y';
  inactiveAxisPosition = cursorTile[inactiveAxis];


  // Now, rewind until we either find an empty square,
  // or we hit the edge of the board.
  while ( cursorTile ) {
    // We've found a new earliest!
    earliestTile = cursorTile;

    tileObject                = { gameId, location: 'board' };
    tileObject[activeAxis]    = cursorTile[activeAxis]-1;
    tileObject[inactiveAxis]  = inactiveAxisPosition;

    // Go back 1 space, and see if there's a tile there.
    // If not, it means we found a blank spot (or the edge of the board).
    // We can break out of this while loop.
    cursorTile = Tiles.findOne(tileObject);
  }

  // Reset our cursor tile, since it was possibly unset when we found a
  // blank square.
  cursorTile = earliestTile;

  // cursorTile now holds the earliest tile in the row.
  // We can advance forwards through the row, adding tiles to our array :)
  while ( cursorTile && cursorTile[activeAxis] < BOARD_SIZE) {
    wordTiles.push( cursorTile );

    tileObject = {
      gameId,
      location: 'board'
    }
    tileObject[activeAxis] = cursorTile[activeAxis]+1;
    tileObject[inactiveAxis] = inactiveAxisPosition;

    cursorTile = Tiles.findOne(tileObject);
  }

  console.log(wordTiles);
  return wordTiles;
}
