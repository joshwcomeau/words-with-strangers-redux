import * as _                 from 'lodash';
import { List, Map, fromJS }  from 'immutable';
import {
  ADD_TILES_TO_RACK,
  PLACE_TILE,
  VALIDATE_PLACEMENT,
  SUBMIT_WORD,
  UPDATE_GAME_STATE
} from '../constants/actions.constants';

// Initial state for the 'game' slice of the state.
export const initialState = fromJS({
  board:  [],
  rack:   [],
  status: {
    isMyTurn: true
  }
});

export default function game(state = initialState, action) {
  switch (action.type) {
    case UPDATE_GAME_STATE:
      // The server sends this after the game state changes in a major way
      // (eg. a move gets placed, which involves moving a bunch of tiles,
      // creating a word, etc.)
      // we want to selectively merge this new state into the old, but we
      // want to take care not to overwrite the local state like the ordering
      // of tiles in the rack.
      return state
        .set( 'rack', fromJS(action.game.rack) )
        .set( 'board', fromJS(action.game.board) );


    case ADD_TILES_TO_RACK:
      // convert tiles to Immutable
      const tiles = fromJS(action.tiles);
      return state.set( 'rack', state.get('rack').concat(tiles) );


    case PLACE_TILE:
      // Find all the data about the original tile (including whether it's
      // located on the board or the rack)
      const [
        originalTile, originalTileIndex, originalTileLocation
      ] = getOriginalTileData(state, action);

      // Create a new tile
      const newTile = createNewTile(state, action, originalTile);
      const newTileLocation = action.tile.location;

      // We aren't actually just moving the tile from one area to another.
      // We'll delete the original tile, and then place a new tile.
      state = state.deleteIn( [originalTileLocation, originalTileIndex] )
      state = state.set( newTileLocation, state.get(newTileLocation).push(newTile) );

      return state;

    case VALIDATE_PLACEMENT:
      return state.setIn(['status', 'isValidPlacement'], action.isValidPlacement)

    case SUBMIT_WORD:
      // We're assuming the word has already been validated, before being
      // submitted to the store. If the action is called, the word is good.

    default:
      return state
  }
}


// HELPER FUNCTIONS
// Should these be here? Not entirely sure how best to structure this.

function getOriginalTileData(state, action) {
  // Helper used in iteration to find the tile by the action's _id
  const tileFinder = tile => {
    return tile.get('_id') === action.tile._id;
  };

  // First, figure out whether the tile is located on the board, or the rack.
  const tileLocation = state.get('rack').find(tileFinder) ? 'rack' : 'board';
  const [ tileIndex, tile ] = state.get(tileLocation).findEntry(tileFinder);

  return [ tile, tileIndex, tileLocation ];
}

function createNewTile(state, action, originalTile) {
  // The tile data sent can be used to make the new tile, except it contains
  // an extraneous field, 'location'. Ditch it!
  let newTileData = _.omit(action.tile, 'location');

  // We want to clone the original tile, but without its coordinates.
  // We'll replace those with the coordinates in action.tile (we can't simply
  // rely on the merge, since we might want to overwrite the existing coords
  // with NO coordinates.)
  let newTile = originalTile
    .delete('y')
    .delete('x')
    .merge(newTileData);


  // Finally, all rack tiles need an 'x'. If none was provided,
  // simply make this the highest 'x' available.
  if ( action.tile.location === 'rack' && !action.tile.x ) {
    newTile = newTile.set('x', state.get(action.tile.location).count());
  }

  return newTile;
}
