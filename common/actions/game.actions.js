import {
  ADD_TILES_TO_RACK,
  PLACE_TILE,
  SUBMIT_WORD,
  SUBSCRIBE_TO_GAME,
  UPDATE_GAME_STATE
} from '../constants/actions.constants';
import { FULL_RACK_SIZE } from '../constants/config.constants';
import {
  getPlacedWord,
  validateWord
}  from '../lib/game_logic.lib';

// TODO: Connect this with server. Meta!
export function addTilesToRack(num = 8) {
  return {
    type:   ADD_TILES_TO_RACK,
  }
}

export function subscribeToGame(gameId) {
  return {
    type: SUBSCRIBE_TO_GAME,
    meta: { remote: '/game' },
    gameId
  }
}

export function updateGameState(game) {
  return {
    type: UPDATE_GAME_STATE,
    game
  }
}

export function placeTile(tile) {
  return {
    type: PLACE_TILE,
    tile
  };
}

export function submitWord(type) {
  // Using redux-thunk, this action returns a function that:
  //   - validates the currently-placed word
  //   - IF the word is valid, it adds the 'turn' to the 'turns' array, and
  //     passes control to the next player.
  //   - ELSE, if the word is invalid, it dispatches an alert (some sort of
  //     flash message alert? TBD) to let the player know.

  return function(dispatch, getState) {
    const initialState      = getState();
    const game              = initialState.toJS().game;
    const boardObj          = game.board;
    const wordTiles         = getPlacedWord(boardObj);
    const isValidWord       = validateWord(wordTiles);


    if ( !isValidWord ) {
      return dispatch({
        type: DISPLAY_ERROR,
        message: "Sorry, that\'s not a word."
      });
    }

    dispatch({
      type: SUBMIT_WORD,
      meta: { remote: '/game' },
      tiles: wordTiles,
      gameId: game._id
    });
  }
}
