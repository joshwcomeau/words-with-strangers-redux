import { ADD_TILES_TO_RACK, PLACE_TILE } from '../constants/actions.constants';
import { fetchTiles }         from '../lib/tiles.lib';

export function addTilesToRack(num) {
  return {
    type:   ADD_TILES_TO_RACK,
    tiles:  fetchTiles(num)
  }
}

export function placeTileAndValidate(tile) {
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

    // Next, check to see if the tile placement is valid
    // TODO
  };
}
