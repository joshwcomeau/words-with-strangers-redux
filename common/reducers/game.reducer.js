import * as _                 from 'lodash';
import { List, Map, fromJS }  from 'immutable';
import {
  ADD_TILES_TO_RACK,
  PLACE_TILE
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
      // Helper used in iteration to find the tile by the action's _id
      const tileFinder = tile => {
        return tile.get('_id') === action.tile._id;
      };

      // First, figure out whether the tile is located on the board, or the rack.
      const tileLocation = state.get('rack').find(tileFinder) ? 'rack' : 'board';

      // Figure out where we want to put the tile (rack or board),
      // and prepare our new tile data
      const newTileLocation = action.tile.location;
      const newTileData = _.omit(action.tile, 'location');

      // Get the original data & merge it with our new data to create our new tile.
      const [tileIndex, tile] = state.get(tileLocation).findEntry(tileFinder);
      const newTile = tile.merge(newTileData);

      // Finally, remove the original tile, and add our new tile
      return state
        .deleteIn( [tileLocation, tileIndex] )
        .set( newTileLocation, state.get(newTileLocation).push(newTile) );


    default:
      return state
  }
}
