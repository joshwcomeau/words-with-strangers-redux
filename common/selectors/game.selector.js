import { createSelector } from 'reselect'
import * as _             from 'lodash';


export function calculateCurrentTurnPlayer (turns, players) {
  // Assuming that the creator of the game is the first player in the
  // 'players' array. I believe this is a safe assumption.

  // Also assuming that you can't join or leave a game that is in progress.
  // May need to revisit this at some point.

  // if nobody's moved yet, it's the creator's turn.
  if ( _.isEmpty(turns) ) return players[0];

  const numOfTurns = turns.length;

  return players[ numOfTurns % players.length ];
}

export function isMyTurn(turns, players) {
  let player = calculateCurrentTurnPlayer(turns, players);
  return !!player.currentUser;
}

const titleSelector           = state => state.get('title');
const boardSelector           = state => state.get('board');
const rackSelector            = state => state.get('rack');
const turnsSelector           = state => state.get('turn');
const playersSelector         = state => state.get('players');
const createdByUserIdSelector = state => state.get('createdByUserId');


const gameSelector = createSelector(
  titleSelector,
  boardSelector,
  rackSelector,
  turnsSelector,
  playersSelector,
  createdByUserIdSelector,
  (title, board, rack, turn, players, createdByUserId) => {
    return {
      title,
      board,
      rack,
      turns,
      players,
      createdByUserId,
      isMyTurn: isMyTurn(turns, players)
    };
  }
);
