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


const gameSelector = createSelector(
  titleSelector,
  boardSelector,
  rackSelector,
  turnsSelector,
  bonusSquaresSelector,
  playersSelector,
  createdByUserIdSelector,
  (title, board, rack, turns, bonusSquares, players, createdByUserId) => {
    return {
      title,
      board,
      rack,
      turns,
      bonusSquares,
      players,
      createdByUserId,
      computed: {
        isMyTurn:         isMyTurn(turns, players),
        isValidPlacement: validatePlacement(board)
      }

    };
  }
);

export default gameSelector;


  //////////////////////////
 //// Helper Functions ////
//////////////////////////

// RETURNS: a Player object
export function calculateCurrentTurnPlayer (turns, players) {
  // Assuming that the creator of the game is the first player in the
  // 'players' array. I believe this is a safe assumption.

  // Also assuming that you can't join or leave a game that is in progress.
  // May need to revisit this at some point.

  // if nobody's moved yet, it's the creator's turn.
  if ( _.isEmpty(turns) ) return _.first(players);

  return players[ turns.length % players.length ];
}

// RETURNS: Boolean
export function isMyTurn(turns, players) {
  // If we don't have any players, it means the server hasn't hydrated the
  // data yet. just set it to false for now; it will be updated.
  if ( _.isEmpty(players) ) return false;

  let player = calculateCurrentTurnPlayer(turns, players);
  return !!player.currentUser;
}

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
