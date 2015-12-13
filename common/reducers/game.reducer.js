import * as _                 from 'lodash';
import { List, Map, fromJS }  from 'immutable';
import { validatePlacement }  from '../lib/game_logic.lib';
import {
  ADD_TILES_TO_RACK,
  PLACE_TILE,
  SUBMIT_WORD
} from '../constants/actions.constants';

// Initial state for the 'game' slice of the state.
export const initialState = fromJS({
  board: [],
  rack:  []
});

export default function game(state = initialState, action) {
  switch (action.type) {
    case ADD_TILES_TO_RACK:
      return state.mergeIn( ['rack'], action.tiles );

    case PLACE_TILE:
      const [
        oldTileLocation, oldTileIndex, newTileLocation, newTileSet
      ] = extractPlaceTileData(state, action)

      // We aren't actually just moving the tile from one area to another.
      // We'll delete the original tile, and then place a new tile.
      return state
        .deleteIn( [oldTileLocation, oldTileIndex] )
        .set( newTileLocation, newTileSet );

    case SUBMIT_WORD:
      // We're going to be using our game_logic lib here, and it's totally
      // decoupled from redux. We need to pass it a plain JS board for it
      // to work with.
      const boardObj = state.get('board').toJS();

      // TODO


    default:
      return state
  }
}


// Helper that fetches all the info we need, to keep clutter out of the
// reducer switch.
function extractPlaceTileData(state, action) {
  // Helper used in iteration to find the tile by the action's _id
  const tileFinder = tile => {
    return tile.get('_id') === action.tile._id;
  };

  // First, figure out whether the tile is located on the board, or the rack.
  const oldTileLocation = state.get('rack').find(tileFinder) ? 'rack' : 'board';

  // Figure out where we want to put the tile (rack or board),
  // and prepare our new tile data
  const newTileLocation = action.tile.location;
  const newTileData = _.omit(action.tile, 'location');

  // Get the original data & merge it with our new data to create our new tile.
  const [oldTileIndex, oldTile] = state.get(oldTileLocation).findEntry(tileFinder);
  const newTile = oldTile.merge(newTileData);

  // Create our new board/rack, with this new tile.
  const newTileSet = state.get(newTileLocation).push(newTile);

  return [ oldTileLocation, oldTileIndex, newTileLocation, newTileSet ];
}
