import * as _ from 'lodash';

import {
  PASS_TURN,
  PICK_TILE,
  PLACE_TILE,
  RECALL_TILES_TO_RACK,
  SHUFFLE_RACK,
  SUBMIT_SWAPPED_TILES,
  SUBMIT_WORD,
  SUBSCRIBE_TO_GAME,
  SWITCH_TILE_POSITIONS,
  TOGGLE_RULES,
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
    type: PICK_TILE,
    meta: { sound: 'game.pickTile' }
  }
}

export function placeTile(tile) {
  return {
    type: PLACE_TILE,
    meta: { sound: 'game.placeTile' },
    tile
  };
}

export function switchTilePositions(tile1, tile2) {
  return {
    type: SWITCH_TILE_POSITIONS,
    meta: { sound: 'game.placeTile' },
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
  return function(dispatch, getState) {

    // Return any tentative tiles to the rack, since the turn shouldn't
    // be ended with stuff on the board.
    dispatch({
      type: RECALL_TILES_TO_RACK
    });

    dispatch({
      type: PASS_TURN,
      meta: {
        favico: 'reset',
        remote: '/game',
        sound: 'game.completeTurn'
      },
      gameId
    });
  }
}

export function toggleRules() {
  return {
    type: TOGGLE_RULES
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

    // Return any tentative tiles to the rack, since the turn shouldn't
    // be ended with stuff on the board.
    dispatch({
      type: RECALL_TILES_TO_RACK
    });

    return dispatch({
      type: SUBMIT_SWAPPED_TILES,
      meta: {
        favico: 'reset',
        remote: '/game',
        sound: 'game.completeTurn'
      },
      tiles,
      gameId
    });
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
  return function(dispatch, getState) {
    // This is a blanket event that fires whenever the server has some kind
    // of update for the client.
    //
    // One of the events that this could represent is the opponent ending their
    // turn, and in this case we want to play a sound effect to notify the
    // player that it's their turn now.
    //
    // It could be a new player entering the game.
    //
    // This could also be the notification that I've won or lost the game.
    // This event also requires a sound.
    //
    // To accomplish this, I'll perform some various checks and attach
    // the sound metadata for the midd
    let action = {
      type: UPDATE_GAME_STATE,
      game
    };

    // If a new player just joined the game, play the sound
    if ( game.players.length > getState().toJS().game.players.length ) {
      action.meta = {
        sound: 'game.playerEnter'
      };
    }
    // If the game is over, play the appropriate win/lose chime.
    else if ( game.status === 'completed' ) {
      const currentUser = _.find(game.players, { currentUser: true });
      const winner      = currentUser.id === game.winnerUserId;
      const sound       = winner ? 'game.win' : 'game.lose';
      action.meta = {
        favico: 'increment',
        sound
      }
    } else {
      const wasMyTurn = getState().getIn(['game', 'isMyTurn']);
      const isMyTurn  = game.isMyTurn;

      if ( (wasMyTurn === false) && (isMyTurn === true) ) {
        action.meta = {
          favico: 'increment',
          sound: 'game.turnNotification'
        };
      }
    }


    return dispatch(action);
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
    const word          = _.map(wordTiles, 'letter').join('').toLowerCase();
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
      meta: {
        favico: 'reset',
        remote: '/game',
        sound: 'game.completeTurn'
      },
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
