import _ from 'lodash';
import { BOARD_SIZE } from '../constants/config.constants.js';

// In development, we don't want to bother loading the dictionary.
let dictionary;
if ( process.env.NODE_ENV !== 'development' ) {
  dictionary = require('../data/words');
}

// NAMING CONVENTION.

// Established and Tentative tiles
//   An "established" tile is one placed in a previous turn; it cannot be moved.
//   It is denoted with a `tileId` field that indicates the turn it was placed
//   in.
//   "tentative" tiles are the opposite: tiles without a turnId, that have
//   just been placed on the board in the current turn, but not yet submitted.

// Tiles and Tile Containers
//   - A 'tile' is an Object with properties like `letter`, `x`, and `y`.
//   - A 'board' is an array of all the tiles currently on the board.
//   - A 'word' is an array of tiles in a gapless sequence on a single axis.
//   - sometimes, a 'tiles' array is used as a miscellaneous assortment of tiles.



// Return an array of tiles that make up the placed word.
// Returns null if the placed word is invalid.
export function getPlacedWord(board) {
  // Looks at the supplied `board` object (a plain-JS array of Tile objects)
  // and plucks out the ones that spell the word. Orders them.
  // If the placed tiles do not equal a word (not all in 1 horizontal/vertical
  // line, or with spaces between them), returns null.

  // 1. Figure out which tiles belong to this turn.
  let tiles = findTentativeTiles(board);
  if ( _.isEmpty(tiles) ) return null;

  // 2. Figure out which axis we're working in, either horizontal or vertical.
  let activeAxis = findActiveAxis(board);
  if ( !activeAxis ) return null;

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

// Check if this tile placement is valid.
export function validatePlacement(board) {
  // First, check to see if they've placed a word (all one axis, no gaps)
  let word = getPlacedWord(board)
  if ( _.isEmpty( word ) ) return false;

  // Next, we need to make sure that the word connects to the established
  // tiles somehow...

  // ...unless, of course, this is the first turn
  if ( isFirstTurn(board) ) return true;

  // If the word incorporates established tiles, we're good!
  if ( _.some(word, isEstablished ) ) return true;

  // Otherwise, we need to check for orthogonal established tiles.
  // _ _ I _ _    Turns   _ _ I _ _
  // _ _ _ _ _     into   _ A T E _
  //
  // To do this, we need to check all neighboring tile spots in the
  // non-primary axis.
  // This is our final check. If it has established neighbors, it's
  // a valid word! Otherwise, it's an unacceptable floater.
  return wordHasEstablishedNeighbors(word, board);
}

export function validateWord(word) {
  // The dictionary is set up as one big object, where the keys are the letters
  // of the alphabet (a-z), and the values are an array of words that start
  // with that letter.

  // To make development life easier, we don't bother checking word validity.
  if ( process.env.NODE_ENV === 'development' ) return true;

  const firstLetter = word[0];
  return _.includes(dictionary[firstLetter], word);
}


// Figure out how many points this set of tiles is worth.
// RETURNS: a Number
export function calculatePointsForWord(tiles, bonusSquares) {
  let bonuses = _.reduce( tiles, (memo, tile) => {
    // We only apply bonuses to tentative tiles.
    if ( isEstablished(tile) ) return memo;

    let bonusSquare = findBonusSquare(tile, bonusSquares);

    if ( !bonusSquare ) return memo;

    // If we found a proper bonus, we'll push it to a bonuses array.
    // After this reduce, we can deal with applying them.
    memo.push(bonusSquare);
    return memo;
  }, []);

  let prunedBonuses = pruneBonuses(bonuses);

  return applyBonuses(tiles, bonuses);
}



// Find the total sum of the word, factoring in all bonuses.
// RETURNS: a Number.
export function applyBonuses(tiles, bonuses) {
  // Because we like big numbers, we're going to apply tile bonuses _before_
  // word bonuses. This means that a 3x Tile bonus with a 3x Word bonus will
  // yield 9 times that tile's point value.

  const scoreWithTileBonuses = _.reduce(tiles, (memo, tile) => {
    const tileBonus = findBonusSquare(tile, bonuses);
    const tileMultiplier = getBonusMultiplier(tileBonus, 'tileMultiplier');

    return memo + tile.points * tileMultiplier;
  }, 0);

  const wordBonus = _.maxBy(bonuses, bonus => bonus.effect.wordMultiplier);
  const wordMultiplier = getBonusMultiplier(wordBonus, 'wordMultiplier');

  return scoreWithTileBonuses * wordMultiplier;
}



// Tiny little helper that always returns a number, when working with bonuses.
// RETURNS: a Number.
export function getBonusMultiplier(bonus, type) {
  if ( _.isEmpty(bonus) ) return 1;
  if ( !bonus.effect ) return 1;
  return bonus.effect[type] || 1;
}



// Weed out any unusable bonuses.
// For example, only one word multiplier may be used, and we want the highest.
// RETURNS: an Array of bonusSquare objects.
export function pruneBonuses(bonusSquares) {
  let highestWordMultiplier = 1;
  let numOfWordMultipliers = 0;

  // Strategy: Partition the bonuses into two lists: One which contains word
  // bonuses, one that does not. Then, just select the best word option,
  // and concat the two lists back together.
  let [wordBonuses, otherBonuses] = _.partition(bonusSquares, bonus => {
    let bonusNames = _.keys(bonus.effect);
    return _.includes(bonusNames, 'wordMultiplier');
  });

  // If we have 0 or 1 word bonuses, we're done!
  if ( wordBonuses.length <= 1) return bonusSquares;

  // Let's sort the word bonuses by desirability
  // Here's our ideal sort result, in ascending order:
  /*
  [
    {
      wordMultiplier: 2
    }, {
      wordMultiplier: 3
    }, {
      wordMultiplier: 2, someOtherBonus: 10
    }, {
      wordMultiplier: 3, someOtherBonus: 2      <-- Bingo!
    },
  ]
  */
  let sortedWordBonuses = _.sortBy(wordBonuses, bonus => {
    // To prioritize bonuses with multiple properties, we're factoring in
    // the number of values > 1, and 'weighing' them at far greater a value
    // than the word multiplier itself.
    // For example, this would weigh the above values:
    // [ 13, 12, 3, 2]
    let wordMultiplier = bonus.effect.wordMultiplier;
    let length = _.values(bonus.effect).length - 1; // Ignore single-value bonuses

    return wordMultiplier + ( length * 10 );
  });

  return otherBonuses.concat( _.last(sortedWordBonuses) )

}

// Figure out how many points this turn is worth.
// Requires a subset of the board for it to use as its base 'turn' word.
// It sums that word, as well as any orthogonally-connected words.
// RETURNS: a Number
export function calculatePointsForTurn(tiles, board, bonusSquares = []) {
  // We pass in the primary axis' word, so we can start by summing its points.
  let points = calculatePointsForWord(tiles, bonusSquares);

  // That's not the whole story though! We need to consider orthogonal words.
  // The way to do that is to iterate through each tentative tile, check the
  // neighbouring tile on the inactive axis, and see if it makes up a word.
  let tentativeTiles  = findTentativeTiles(tiles);
  let inactiveAxis    = findInactiveAxis(tiles);

  tentativeTiles.forEach( tile => {
    let orthogonalTiles = rewindAndCaptureWord({
      activeAxis: inactiveAxis,
      tiles:      [tile],
      board
    });

    // If there are any established tiles in this orthogonal word,
    // we get the points for it as well!
    let hasEstablishedTiles = _.some(orthogonalTiles, isEstablished );
    if ( hasEstablishedTiles ) {
      points += calculatePointsForWord(orthogonalTiles);
    }
  });

  return points;
}





  //////////////////////////
 //// Helper Functions ////
//////////////////////////
// Exposed primarily so they can be tested, although they're generic enough
// that they can be called from the outside if needed.


// Is this tile tentative? (brand new. Not yet connected to a turn)
// RETURNS: Boolean
export function isTentative(tile) {
  if ( !tile || typeof tile !== 'object' ) return false;
  return typeof tile.turnId === 'undefined'
}

// Is this tile established? (was placed in a previous turn)
// RETURNS: Boolean
export function isEstablished(tile) {
  if ( !tile || typeof tile !== 'object' ) return false;
  return !isTentative(tile);
}

// Find all the tiles on the board that haven't been committed to a turn yet.
// RETURNS: An array [ <Tile object>, <Tile object> ]
export function findTentativeTiles(board) {
  return _.filter(board, isTentative );
};

// Given X/Y coordinates, fetch a tile!
// RETURNS: A tile object
export function findTile({x, y}, board) {
  return _.find( board, tile => (tile.x === x && tile.y === y) );
}

export function findBonusSquare(tile, bonusSquares) {
  // The functionality of this is identical to `findTile`, just with different
  // language. Going to keep the separate for now in case the logic changes.
  return findTile(tile, bonusSquares);
}


// Compute whether there have been any finished turns yet
// RETURNS: Boolean.
export function isFirstTurn(board) {
  return _.every( board, isTentative );
}


// Figure out whether the tiles form a horizontal or vertical line.
// RETURNS: either:
//   - a String (enum: ['x', 'y']) if the move is valid, or
//   - a Boolean (false) if the move is invalid.
export function findActiveAxis(board) {
  // If this is the first move of the game, and it's only a single letter,
  // we can't possibly determine which axis they intended.
  // Fortunately, it doesn't matter.
  if ( board.length === 1 ) return 'x';

  // For most evaluations, we only care about tentative tiles.
  let relevantTiles = board.filter( isTentative );

  // If there are no tentative tiles, there's no active axis.
  if ( _.isEmpty(relevantTiles) ) return false;

  // If we've only placed a single tile, the rules change.
  // To determine its axis, we need to look at its neighbours, to see
  // which axis/axes we're extending.
  let singleTentativeTile = relevantTiles.length === 1;
  if ( singleTentativeTile ) {
    let neighbours = findNeighbouringTiles( relevantTiles[0], board );

    // If we haven't found any neighbours, it means this is an illegal move.
    // (we already handled the case of this being the first move of the game,
    // in the first statement of this function).
    if ( _.isEmpty(neighbours) ) return false;

    relevantTiles = relevantTiles.concat( neighbours );
  }

  const deltaX = getDeltaOfAxis(relevantTiles, 'x');
  const deltaY = getDeltaOfAxis(relevantTiles, 'y');

  // If all the tiles are on the same row/column, the delta for that axis
  // will be zero. If both axes are more than zero, it means we have tiles
  // that aren't neatly in a single row or column.
  // EXCEPTION: If we've only placed a single tile, we consider the neighbors.
  // Because of that, it's possible for both axes to have a delta.
  // In that case, we default to 'x' (the 'y' will be orthogonal)
  if ( deltaX && deltaY && !singleTentativeTile) return false;

  return deltaX ? 'x' : 'y';
}

export function findInactiveAxis(board) {
  const activeAxis = findActiveAxis(board);
  if ( !activeAxis ) return false;

  return activeAxis === 'x' ? 'y' : 'x';
}

// Get the 0-4 neighbours that surround a specified tile.
// RETURNS: An array of tiles
export function findNeighbouringTiles(tile, board) {
  const coordsArray = [
    { x: tile.x-1, y: tile.y   },
    { x: tile.x,   y: tile.y+1 },
    { x: tile.x,   y: tile.y-1 },
    { x: tile.x+1, y: tile.y   }
  ];

  return _(coordsArray)
    .map( coords => findTile(coords, board) )
    .compact()
    .value();
}



// Figure out how many tiles apart the highest/lowest tile are, on a given axis
// RETURNS: An integer
export function getDeltaOfAxis(tiles, axis) {
  const axisPoints = tiles.map( tile => tile[axis]).sort();
  return _.last(axisPoints) - _.head(axisPoints);
}



// Figure out if the word has any neighbouring established tiles.
// RETURNS: Boolean
export function wordHasEstablishedNeighbors(word, board) {
  const activeAxis    = findActiveAxis(word);
  const inactiveAxis  = activeAxis !== 'x' ? 'x' : 'y';

  let upperNeighbor, upperNeighborCoords, lowerNeighbor, lowerNeighborCoords;

  return _.some(word, tile => {

    upperNeighborCoords = _.pick(tile, ['x', 'y']);
    lowerNeighborCoords = _.pick(tile, ['x', 'y']);
    upperNeighborCoords[inactiveAxis]++;
    lowerNeighborCoords[inactiveAxis]--;

    upperNeighbor = findTile(upperNeighborCoords, board);
    lowerNeighbor = findTile(lowerNeighborCoords, board);

    return isEstablished(upperNeighbor) || isEstablished(lowerNeighbor);
  });
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
  earliestTile = _.head( _.sortBy(tiles, tile => tile[activeAxis]) );

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
    cursorTile = findTile(tileObject, board);
  }

  // Reset our cursor tile, since it was unset to break out of the `while` loop
  cursorTile = earliestTile;

  // cursorTile now holds the earliest tile in the row.
  // We can advance forwards through the row, adding tiles to our array :)
  while ( cursorTile ) {
    wordTiles.push( cursorTile );

    tileObject = _.pick(cursorTile, [activeAxis, inactiveAxis]);
    tileObject[activeAxis]  += 1;
    cursorTile = findTile(tileObject, board);
  }

  // Finally do a check to make sure the word we've captured contains ALL
  // of the tiles we passed in. This is to avoid 'gaps' between our tiles.
  // Consider this board:
  // _ A _ _ _ _ T _ L _ _ _

  // We place 3 tiles:
  // _ A L L _ _ T I L E S _
  //     * *       *

  const wordContainsAllTiles = _.every(tiles, tile => {
    return _.find(wordTiles, { id: tile.id });
  });
  if ( !wordContainsAllTiles ) return null;

  return wordTiles;
}
