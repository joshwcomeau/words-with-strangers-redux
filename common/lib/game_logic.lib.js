import * as _ from 'lodash';
import { BOARD_SIZE } from '../constants/config.constants.js';

export function getPlacedWord(board) {
  // Looks at the supplied `board` object (a plain-JS array of Tile objects)
  // and plucks out the ones that spell the word. Orders them.
  // If the placed tiles do not equal a word (not all in 1 horizontal/vertical
  // line, or with spaces between them), returns null.

  // 1. Figure out which tiles belong to this turn.
  let tiles = _.filter(board, tile => typeof tile.turnId === 'undefined');

  // 2. Figure out which axis we're working in, either horizontal or vertical.
  let activeAxis = findActiveAxis(tiles);

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
  return rewindAndCaptureWord({ activeAxis, tiles, board });

}

export function validatePlacement(board) {
  // 1. Figure out which tiles belong to this turn.
  let tiles = _.filter(board, tile => typeof tile.turnId === 'undefined');

  // 2. Figure out which axis we're working in, either horizontal or vertical.
  let activeAxis = findActiveAxis(tiles);

  // If there isn't a single axis, we know it's false.
  if ( !activeAxis ) return false;

  let inactiveAxis = activeAxis !== 'x' ? 'x' : 'y';
  let inactiveAxisPosition = cursorTile[inactiveAxis];

  // Next, Check to make sure there aren't any 'gaps' without tiles.
  tiles = sortTilesByAxis(tiles, activeAxis);
  let firstPosition = _.first(tiles)[activeAxis];
  let lastPosition  = _.last(tiles)[activeAxis];
  // We just need to iterate from the earliest position to the latest position,
  // And ensure that every spot has a tile.
  let positionsToAccountFor = _.range(firstPosition+1, lastPosition);

  let tileObject;

  _.every(positionsToAccountFor, position => {
    tileObject = {};
    tileObject[activeAxis] = position;
    tileObject[inactiveAxis] = inactiveAxisPosition;

    return findTile(tileObject, board);
  })


}

export function validateWord(tiles) {
  // TODO: Incorporate a dictionary. Check against it.
  return true;
}

export function sortTilesByAxis(tiles, axis) {
  // TODO: Return a sorted array by the axis given.
  return tiles;
}






// HELPER FUNCTIONS
// Exposed primarily so they can be tested, although they're generic enough
// that they can be called from the outside if needed.

// Given X/Y coordinates, fetch a tile!
// RETURNS: An array [ tileObject, tileObjectIndex ]
export function findTile({x, y}, board) {
  let tileIndex = _.findIndex( board, tile => (tile.x === x && tile.y === y) );

  if ( tileIndex === -1 ) return undefined;

  return [ board[tileIndex], tileIndex ];
}

// Figure out whether the tiles form a horizontal or vertical line.
// RETURNS: either:
//   - a String (enum: ['x', 'y']) if the move is valid, or
//   - a Boolean (false) if the move is invalid.
export function findActiveAxis(tiles) {
  // Don't consider tiles placed in previous turns
  tiles = _.reject( tiles, tile => !!tile.turnId )
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
export function rewindAndCaptureWord({ activeAxis, tiles, board}) {
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
  let nextTile;             // Placeholder
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

    // Go back 1 space, and see if there's a tile there.
    // If not, it means we found a blank spot (or the edge of the board).
    // We can break out of this while loop.

    // Start by creating a new object with the X/Y coords
    tileObject = _.pick(cursorTile, [activeAxis, inactiveAxis]);

    // Subtract 1 from the active axis, and find it.
    tileObject[activeAxis]  -= 1;
    nextTile = findTile(tileObject, board);
    cursorTile = nextTile ? nextTile[0] : null
  }

  // Reset our cursor tile, since it was unset to break out of the `while` loop
  cursorTile = earliestTile;

  // cursorTile now holds the earliest tile in the row.
  // We can advance forwards through the row, adding tiles to our array :)
  while ( cursorTile ) {
    wordTiles.push( cursorTile );

    tileObject = _.pick(cursorTile, [activeAxis, inactiveAxis]);
    tileObject[activeAxis]  += 1;
    nextTile = findTile(tileObject, board);
    cursorTile = nextTile ? nextTile[0] : null
  }

  return wordTiles;
}
