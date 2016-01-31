import { createSelector } from 'reselect'
import _                  from 'lodash';

import {
  validatePlacement,
  getPlacedWord,
  calculatePointsForTurn
}  from '../lib/game_logic.lib';

const idSelector              = state => state.game.id;
const statusSelector          = state => state.game.status;
const titleSelector           = state => state.game.title;
const boardSelector           = state => {
  let board = addLocationToTiles(state, 'board');
  board = addTurnPointsToEndOfWord(state, board);
  return board;
};
const rackSelector            = state => addLocationToTiles(state, 'rack');
const turnsSelector           = state => state.game.turns;
const bonusSquaresSelector    = state => state.game.bonusSquares;
const swapSelector            = state => addLocationToTiles(state, 'swap');
const playersSelector         = state => {
  // We also want to store the points that each player has earned in this
  // game so far, on the players object.
  let turnsByPlayers = _.groupBy(state.game.turns, 'playerId');

  return state.game.players.map( player => {
    player.points = _.sumBy( turnsByPlayers[player.id], 'points');
    return player;
  }).sort( (p1, p2) => p2.points - p1.points );
}
const createdByUserIdSelector = state => state.game.createdByUserId;
const isMyTurnSelector = state => state.game.isMyTurn;
const isSwapActiveSelector = state => state.game.isSwapActive;
const isViewingRulesSelector = state => state.game.isViewingRules;
const isWinnerSelector = state => {
  if ( state.game.status !== 'completed' ) return undefined;

  const currentUser = _.find(state.game.players, { currentUser: true });

  return state.game.winnerUserId === currentUser.id
}
const authUserSelector = state => state.auth.user;


const gameSelector = createSelector(
  idSelector,
  statusSelector,
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
  isViewingRulesSelector,
  isWinnerSelector,
  authUserSelector,
  (id, status, title, board, rack, turns, bonusSquares, swap, players, createdByUserId, isMyTurn, isSwapActive, isViewingRules, isWinner, authUser) => {
    return {
      id,
      status,
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
      isViewingRules,
      isWinner,
      authUser,
      computed: {
        isSpectator: isSpectator(players),
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

// RETURNS: Boolean
export function isSpectator(players) {
  return !_.find(players, { currentUser: true })
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
