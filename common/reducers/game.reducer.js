import * as _                 from 'lodash';
import { List, Map, fromJS }  from 'immutable';
import {
  ADD_TILES_TO_RACK,
  PLACE_TILE,
  SWITCH_TILE_POSITIONS,
  SUBMIT_WORD,
  UPDATE_GAME_STATE,
  UNSUBSCRIBE_FROM_GAME,
  SHUFFLE_RACK,
  RECALL_TILES_TO_RACK
} from '../constants/actions.constants';
import { calculatePointsForTurn }    from '../lib/game_logic.lib';

// Initial state for the 'game' slice of the state.
export const initialState = fromJS({
  board:    [],
  rack:     [],
  turns:    [],
  players:  []
});

export default function game(state = initialState, action) {
  switch (action.type) {
    case UPDATE_GAME_STATE:
      // The server sends this after the game state changes in a major way
      // (eg. a move gets placed, which involves moving a bunch of tiles,
      // creating a word, etc.)

      // On the server, tiles in the rack don't have an 'x' coordinate.
      // On the client, though, we want tiles to be sortable based on this
      // value.
      let game = fromJS(action.game);

      game = game.set('rack', resetRackTilePosition( game.get('rack') ));

      return state.mergeDeep( game );

    case UNSUBSCRIBE_FROM_GAME:
      // this is called when the component unmounts. We can simply restore
      // the state to its default condition, so that it doesn't interfere
      // when we subscribe to new games.
      return initialState;

    case ADD_TILES_TO_RACK:
      // convert tiles to Immutable
      const tiles = fromJS(action.tiles);
      return state.set( 'rack', state.get('rack').concat(tiles) );

    case SWITCH_TILE_POSITIONS:
      // We can simply drag a tile onto another tile to swap positions with it.

      // We need to find both tiles' original data
      const [
        tile1Props, tile1Index, tile1Location
      ] = getOriginalTileData(state, action.tile1);
      const [
        tile2Props, tile2Index, tile2Location
      ] = getOriginalTileData(state, action.tile2);

      const newTile1Coords = {
        x: tile2Props.get('x'),
        y: tile2Props.get('y')
      }
      const newTile2Coords = {
        x: tile1Props.get('x'),
        y: tile1Props.get('y')
      }

      state = state.setIn( [tile2Location, tile2Index], tile2Props.merge(newTile2Coords));

      state = state.setIn( [tile1Location, tile1Index], tile1Props.merge(newTile1Coords));


      return state;


    case PLACE_TILE:
      // Find all the data about the original tile (including whether it's
      // located on the board or the rack)
      const [
        originalTile, originalTileIndex, originalTileLocation
      ] = getOriginalTileData(state, action.tile);

      // Create a new tile
      const newTile = createNewTile(state, action, originalTile);
      const newTileLocation = action.tile.location;

      // We aren't actually just moving the tile from one area to another.
      // We'll delete the original tile, and then place a new tile.
      state = state.deleteIn( [originalTileLocation, originalTileIndex] )
      state = state.set( newTileLocation, state.get(newTileLocation).push(newTile) );

      return state;


    case SHUFFLE_RACK:
      const rack = resetRackTilePosition( fromJS(action.tiles) );
      return state.set('rack', rack);


    case SUBMIT_WORD:
      // NOTE: This is just for optimistic rendering.
      // The _real_ submission happens on the server, and if it succeeds,
      // it sends an UPDATE_GAME_STATE event to the client.

      // Figure out what word they're spelling
      const word    = _.pluck( action.tiles, 'letter').join('');
      const points  = calculatePointsForTurn( action.tiles, state.get('board').toJS() );
      const player  = state.get('players').find( player => {
        return player.get('currentUser');
      });

      // Create a new turn.
      return state.set('turns', state.get('turns').push(Map({
        word,
        points,
        id: state.get('turns').size,
        playerId: player.get('id')
      })));



    case RECALL_TILES_TO_RACK:
      // This is made tricky by the fact that we need to reset the tiles'
      // 'x' coordinate. The easiest way to accomplish this is to pull them
      // all back in, setting the X to the array index position as we go.

      function isTentative(tile) {
        return typeof tile.get('turnId') === 'undefined';
      }

      // Create a copy of all the tentative tiles, and strip each copied
      // tile of their coordinates.
      const tentativeTiles = state
        .get('board')
        .filter( isTentative )
        .map( tile => tile.delete('x').delete('y'));

      // Remove them from the board
      state = state.set('board', state.get('board').filterNot( isTentative ) );

      // Add them to the rack
      state = state.set('rack', state.get('rack').concat(tentativeTiles))

      // Finally, update the 'x' coordinate of all tentative tiles.
      state = state.set('rack', resetRackTilePosition( state.get('rack') ));

      return state;


    default:
      return state
  }
}


// HELPER FUNCTIONS
// Should these be here? Not entirely sure how best to structure this.

function resetRackTilePosition(rack) {
  return rack.map( (tile, index) => tile.set('x', index) );
}

function getOriginalTileData(state, actionTile) {
  const tileFinder = tile => {
    return tile.get('id') === actionTile.id;
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
