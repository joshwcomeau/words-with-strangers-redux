import {
  ADD_TILES_TO_RACK,
  PLACE_TILE,
  VALIDATE_PLACEMENT,
  SUBMIT_WORD,
  SUBSCRIBE_TO_GAME,
  UPDATE_GAME_STATE
} from '../constants/actions.constants';
import { FULL_RACK_SIZE } from '../constants/config.constants';
import {
  getPlacedWord,
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
  // Using redux-thunk, this action returns a function that:
  //   - dispatches the PLACE_TILE event, which places the tile in the new pos.
  //   - figures out if the current configuration of tiles can be submitted
  //     (essentially works out if the tiles are all in a straight line, etc).
  // The combination of these actions means that the board is updated, and the
  // 'SUBMIT_WORD' button can be enabled/disabled, depending on the validity.

  return function(dispatch, getState) {
    // start by placing the tile
    dispatch({
      type: PLACE_TILE,
      tile
    });

    // Update the validity of this tile placement.
    // If it's a valid placement, we enable the "submit word" button.
    const boardObj          = getState().toJS().game.board;
    const isValidPlacement  = !!getPlacedWord(boardObj);

    dispatch({
      type: VALIDATE_PLACEMENT,
      isValidPlacement
    });
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
    const boardObj          = initialState.get('board').toJS();
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
      word: wordTiles
    });

    dispatch({
      type: END_TURN
    });

    // We need to replenish the user's rack!
    const numOfTilesToRefill = FULL_RACK_SIZE - getState().get('rack').count();
    dispatch( addTilesToRack(numOfTilesToRefill) )
  }
}
