import { createSelector } from 'reselect'
import * as _             from 'lodash';

import {
  validatePlacement,
  getPlacedWord,
  calculatePointsForTurn
}  from '../lib/game_logic.lib';


const boardSelector           = state => {
  let board = addLocationToTiles(state, 'board');
  board = addTurnPointsToEndOfWord(state, board);
  return board;
};
const rackSelector            = state => addLocationToTiles(state, 'rack');
const titleSelector           = state => state.game.title;
const turnsSelector           = state => state.game.turns;
const bonusSquaresSelector    = state => state.game.bonusSquares;
const swapSelector            = state => state.game.swap;
const playersSelector         = state => {
  // We also want to store the points that each player has earned in this
  // game so far, on the players object.
  let turnsByPlayers = _.groupBy(state.game.turns, 'playerId');

  return state.game.players.map( player => {
    player.points = _.sum( turnsByPlayers[player.id], 'points');
    return player;
  });
}
const createdByUserIdSelector = state => state.game.createdByUserId;
const isMyTurnSelector = state => state.game.isMyTurn;
const isSwapActiveSelector = state => state.game.isSwapActive;



const gameSelector = createSelector(
  titleSelector,
  boardSelector,
  rackSelector,
  turnsSelector,
  bonusSquaresSelector,
  swapSelector,
  playersSelector,
  createdByUserIdSelector,
  isMyTurnSelector,
  isSwapActiveSelector,
  (title, board, rack, turns, bonusSquares, swap, players, createdByUserId, isMyTurn, isSwapActive) => {
    return {
      title,
      board,
      rack,
      turns,
      bonusSquares,
      swap,
      players,
      createdByUserId,
      isMyTurn,
      isSwapActive,
      computed: {
        isValidPlacement: validatePlacement(board)
      }

    };
  }
);

export default gameSelector;


  //////////////////////////
 //// Helper Functions ////
//////////////////////////

// RETURNS: Boolean
export function isValidPlacement(board) {
  return validatePlacement(board);
}


// RETURNS: An Array of Tile objects
function addLocationToTiles(state, location) {
  // For the tiles in the board and rack, we want to extend them with a 'location'
  // property. That way, if we have a tile without its parent game object, we
  // will still know where it belongs.
  return state.game[location].map( tile => _.extend(tile, { location: location}) )
}

// RETURNS: an Array of Tile objects
function addTurnPointsToEndOfWord(state, tiles) {
  // We also want to tally up the current turn points total, so we can display
  // it on the board. We'll append it to the last tile in the current word.
  const wordTiles = getPlacedWord(tiles);

  // If the turn is invalid, we can't speculate on what the turn is worth.
  if ( !wordTiles ) return tiles;

  const points = calculatePointsForTurn(
    wordTiles,
    tiles,
    state.game.bonusSquares
  );

  const lastTileId    = _.last(wordTiles).id;
  const lastTileIndex = _.findIndex(tiles, {id: lastTileId});

  tiles[lastTileIndex].turnPoints = points;

  return tiles;
}
