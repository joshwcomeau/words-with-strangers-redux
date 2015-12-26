import { createSelector } from 'reselect'
import * as _             from 'lodash';

import {
  validatePlacement
}  from '../lib/game_logic.lib';


export function calculateCurrentTurnPlayer (turns, players) {
  // Assuming that the creator of the game is the first player in the
  // 'players' array. I believe this is a safe assumption.

  // Also assuming that you can't join or leave a game that is in progress.
  // May need to revisit this at some point.

  // if nobody's moved yet, it's the creator's turn.
  if ( _.isEmpty(turns) ) return _.first(players);

  return players[ turns.length % players.length ];
}

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

const titleSelector           = state => state.game.title;
const boardSelector           = state => state.game.board;
const rackSelector            = state => state.game.rack;
const turnsSelector           = state => state.game.turns;
const playersSelector         = state => state.game.players;
const createdByUserIdSelector = state => state.game.createdByUserId;


const gameSelector = createSelector(
  titleSelector,
  boardSelector,
  rackSelector,
  turnsSelector,
  playersSelector,
  createdByUserIdSelector,
  (title, board, rack, turns, players, createdByUserId) => {
    return {
      title,
      board,
      rack,
      turns,
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
