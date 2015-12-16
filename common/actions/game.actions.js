import {
  ADD_TILES_TO_RACK,
  PLACE_TILE,
  VALIDATE_PLACEMENT,
  SUBMIT_WORD
} from '../constants/actions.constants';
import { fetchTiles }         from '../lib/tiles.lib';
import {
  getPlacedWord,
}  from '../lib/game_logic.lib';

export function addTilesToRack(num = 8) {
  return {
    type:   ADD_TILES_TO_RACK,
    tiles:  fetchTiles(num)
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
    const boardObj = getState().get('board').toJS();
    const isValid  = !!getPlacedWord(boardObj);

    dispatch({
      type: VALIDATE_PLACEMENT,
      isValid
    });
  };
}

export function submitWord(type) {
  // Using redux-thunk, this action returns a function that:
  //   - validates the currently-placed word for evaluation
  //   - IF the word is valid, it adds the 'turn' to the 'turns' array, and
  //     passes control to the next player.
  //   - ELSE, if the word is invalid, it dispatches an alert (some sort of
  //     flash message alert? TBD) to let the player know.

  return function(dispatch, getState) {
    // First, validate the tile placement.
    // We're going to be using our game_logic lib here, and it's totally
    // decoupled from redux. We need to pass it a plain JS board for it
    // to work with.
    const boardObj  = getState().get('board').toJS();
    const wordTiles = getPlacedWord(boardObj)

    if ( wordTiles ) {
      dispatch({
        type: SUBMIT_WORD,
        word: wordTiles
      });

      dispatch({
        type: END_TURN
      });
    } else {
      dispatch({
        type: DISPLAY_ERROR,
        message: 'Sorry, that word is not placed properly.'
      });
    }
  }
}
