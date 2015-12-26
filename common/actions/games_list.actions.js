import {
  REQUEST_GAMES_LIST,
  ADD_GAMES_TO_LIST,
  JOIN_GAME,
  CREATE_GAME
} from '../constants/actions.constants';
import { pushPath } from 'redux-simple-router';

export function requestGamesList() {
  return {
    type: REQUEST_GAMES_LIST,
    meta: { remote: '/gamesList' }
  }
}

export function addGamesToList(games) {
  if ( typeof games === 'string' ) games = [games];
  return {
    type: ADD_GAMES_TO_LIST,
    games
  }
}

export function joinGame(gameId) {
  return function(dispatch, getState) {
    dispatch({
      type: JOIN_GAME,
      meta: { remote: '/game' },
      gameId
    });

    dispatch(pushPath(`/games/${gameId}`))
  }
  return ;
}

export function createGame() {
  return {
    type: CREATE_GAME,
    meta: { remote: '/game' }
  }
}
