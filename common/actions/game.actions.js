import * as _ from 'lodash';

import {
  PICK_TILE,
  PLACE_TILE,
  RECALL_TILES_TO_RACK,
  SHUFFLE_RACK,
  SUBMIT_SWAPPED_TILES,
  SUBMIT_WORD,
  SUBSCRIBE_TO_GAME,
  SWITCH_TILE_POSITIONS,
  TOGGLE_SWAPPING,
  UNSUBSCRIBE_FROM_GAME,
  UPDATE_GAME_STATE
} from '../constants/actions.constants';
import { FULL_RACK_SIZE } from '../constants/config.constants';
import { updateFlashMessage } from './ui.actions';
import {
  getPlacedWord,
  validateWord
}  from '../lib/game_logic.lib';


export function pickTile() {
  return {
    type: PICK_TILE
  }
}

export function placeTile(tile) {
  return {
    type: PLACE_TILE,
    tile
  };
}

export function switchTilePositions(tile1, tile2) {
  return {
    type: SWITCH_TILE_POSITIONS,
    tile1,
    tile2
  }
}

export function subscribeToGame(gameId) {
  return {
    type: SUBSCRIBE_TO_GAME,
    meta: { remote: '/game' },
    gameId
  }
}

export function passTurn(gameId) {
  return {
    type: PASS_TURN,
    meta: { remote: '/game' },
    gameId
  }
}

export function toggleSwapping() {
  return {
    type: TOGGLE_SWAPPING
  }
}

export function submitSwappedTiles() {
  return function(dispatch, getState) {
    const tiles   = getState().get('game').get('swap').toJS();
    const gameId  = getState().getIn(['game', 'id']);

    return dispatch({
      type: SUBMIT_SWAPPED_TILES,
      meta: { remote: '/game'},
      tiles,
      gameId
    })
  }
}

export function unsubscribeFromGame(gameId) {
  return {
    type: UNSUBSCRIBE_FROM_GAME,
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



export function submitWord(type) {
  // Using redux-thunk, this action returns a function that:
  //   - validates the currently-placed word
  //   - IF the word is valid, it adds the 'turn' to the 'turns' array, and
  //     passes control to the next player.
  //   - ELSE, if the word is invalid, it dispatches an alert (some sort of
  //     flash message alert? TBD) to let the player know.

  return function(dispatch, getState) {
    const initialState  = getState();
    const game          = initialState.toJS().game;
    const boardObj      = game.board;
    const wordTiles     = getPlacedWord(boardObj);
    const word          = _.pluck(wordTiles, 'letter').join('').toLowerCase();
    const isValidWord   = validateWord(word);


    if ( !isValidWord ) {
      return dispatch(updateFlashMessage(
        "Sorry, that's not a word.",
        'error',
        2000
      ));
    }

    dispatch({
      type: SUBMIT_WORD,
      meta: { remote: '/game' },
      tiles: wordTiles,
      gameId: game.id
    });
  }
}

export function shuffleRack() {
  return function(dispatch, getState) {
    // We need to do the shuffling out here because we can't do any kind
    // of randomization inside the reducer; wouldn't be pure.
    let tiles = _.shuffle( getState().toJS().game.rack );

    dispatch({
      type: SHUFFLE_RACK,
      tiles
    })
  }
}

export function recallTilesToRack() {
  return {
    type: RECALL_TILES_TO_RACK
  }
}
