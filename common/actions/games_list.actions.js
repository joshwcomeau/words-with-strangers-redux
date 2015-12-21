import {
  ADD_GAMES_TO_LIST,
  JOIN_GAME,
  CREATE_GAME
} from '../constants/actions.constants';
import { pushPath } from 'redux-simple-router';

export function addGamesToList(games) {
  if ( typeof games === 'string' ) games = [games];
  return {
    type:   ADD_GAMES_TO_LIST,
    games
  }
}

export function joinGame(game) {
  return function(dispatch, getState) {
    // TODO: Join game stuff. Middleware API stuff.
  };
}

export function createGame() {
  // TODO
}
