import * as _                 from 'lodash';
import { List, Map, fromJS }  from 'immutable';
import {
  PASS_TURN,
  PLACE_TILE,
  RECALL_TILES_TO_RACK,
  SHUFFLE_RACK,
  SUBMIT_SWAPPED_TILES,
  SUBMIT_WORD,
  SWITCH_TILE_POSITIONS,
  TOGGLE_SWAPPING,
  UNSUBSCRIBE_FROM_GAME,
  UPDATE_GAME_STATE
} from '../constants/actions.constants';
import {
  getPlacedWord,
  calculatePointsForTurn
}    from '../lib/game_logic.lib';

// Initial state for the 'game' slice of the state.
export const initialState = fromJS({
  board:        [],
  rack:         [],
  turns:        [],
  players:      [],
  bonusSquares: [],
  swap: {
    active: false,
    bucket: []
  }
});

export default function game(state = initialState, action) {
  switch (action.type) {
    case PASS_TURN:
      // NOTE: This is just for optimistic rendering.
      // The _real_ submission happens on the server, and if it succeeds,
      // it sends an UPDATE_GAME_STATE event to the client.
      const newTurn = fromJS({
        playerId: getCurrentPlayer(state).get('id'),
        points: 0,
        pass: true
      })
      return state.update( 'turns', turns => turns.push(newTurn) );


    case PLACE_TILE:
      // Find all the data about the original tile (including whether it's
      // located on the board or the rack)
      const [
        originalTile, originalTileIndex, originalTileLocation
      ] = getOriginalTileData(state, action.tile);

      // Create a new tile
      const newTile = createCopyOfTile(state, action, originalTile);
      const newTileLocation = action.tile.location;

      let newTileLookupPath;
      if ( newTileLocation === 'swap' ) {
        newTileLookupPath = ['swap', 'bucket'];
      } else {
        newTileLookupPath = [newTileLocation]
      }

      // We aren't actually just moving the tile from one area to another.
      // We'll delete the original tile, and then place a new tile.
      state = state.deleteIn( originalTileLocation.concat(originalTileIndex) );
      state = state.updateIn( newTileLookupPath, tiles => tiles.push(newTile) );

      // If we place a tile on top of a rack tile, it needs to take its place
      // and push all subsequent tiles down 1 position.
      if ( newTileLocation === 'rack' ) {
        // Check to see if we have a duplicate 'x'
        const rack = state.get('rack').toJS();
        const xPositions = _.pluck(rack, 'x');

        // if there's no conflict, we're good!
        if ( xPositions.length === _.uniq(xPositions.length) ) return state;

        // If there are multiple tiles at the same X position, we have some
        // sorting out to do.
        state = state.update('rack', tiles => tiles.map( tile => {
          if (
            tile.get('x') >= newTile.get('x') &&
            tile.get('id') !== newTile.get('id')
          ) {
            return tile.update('x', x => x + 1);
          } else {
            return tile;
          }
        }));
      }

      // If we aren't careful, our rack tile's X coordinates will stop
      // being continuous. For example, if we move the 5th tile to the board,
      // there will be a gap in the sequence when the 4th and 6th tiles don't
      // update!
      state = state.update('rack', orderAndResetRack);

      return state;


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


    case SHUFFLE_RACK:
      const rack = resetRackTilePosition( fromJS(action.tiles) );
      return state.set('rack', rack);


    case SUBMIT_WORD:
      // NOTE: This is just for optimistic rendering.
      // The _real_ submission happens on the server, and if it succeeds,
      // it sends an UPDATE_GAME_STATE event to the client.

      // Figure out what word they're spelling
      const word    = _.pluck( action.tiles, 'letter').join('');
      const points  = calculatePointsForTurn(
        action.tiles,
        state.get('board').toJS(),
        state.get('bonusSquares').toJS()
      );
      const player  = getCurrentPlayer(state);

      // Create a new turn.
      return state.update('turns', turns => turns.push(Map({
        word,
        points,
        id: state.get('turns').size,
        playerId: player.get('id')
      })));


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


      case TOGGLE_SWAPPING:
        if ( state.getIn(['swap', 'active']) ) {
          // If we're cancelling our swap, we need to toggle the `active`
          // property, but also relegate any tiles in the swap bucket back
          // to the rack.
          const swapTiles = state.getIn([ 'swap', 'bucket' ]);

          return state
            .setIn(['swap', 'active'], false)
            // Empty out all tiles in the swap bucket
            .setIn(['swap', 'bucket'], new List())
            .update('rack', rack => rack.concat(swapTiles))
            .update('rack', orderAndResetRack);
        } else {
          // If we're activating the swap area, we just need to toggle it.
          return state.setIn(['swap', 'active'], true);
        }


    case UNSUBSCRIBE_FROM_GAME:
      // this is called when the component unmounts. We can simply restore
      // the state to its default condition, so that it doesn't interfere
      // when we subscribe to new games.
      return initialState;


    case UPDATE_GAME_STATE:
      // The server sends this after the game state changes in a major way
      // (eg. a move gets placed, which involves moving a bunch of tiles,
      // creating a word, etc.)

      // We first want to omit any data the server sends, that doesn't affect
      // our UI state
      let trimmedGame = _.omit(action.game,
        ['createdAt', 'updatedAt', 'createdByUserId']
      );

      let game = fromJS(trimmedGame);

      // On the server, tiles in the rack don't have an 'x' coordinate.
      // On the client, though, we want tiles to be sortable based on this
      // value.
      game = game.update('rack', resetRackTilePosition);

      return state.mergeDeep( game );

    default:
      return state
  }
}


  //////////////////////////
 //// Helper Functions ////
//////////////////////////

function resetRackTilePosition(rack) {
  return rack.map( (tile, index) => {
    return tile.set('x', index)
  });
}

function orderTilesByX(tiles) {
  return tiles.sortBy( tile => tile.get('x') )
}

function orderAndResetRack(tiles) {
  return _.compose(resetRackTilePosition, orderTilesByX).call(null, tiles);
}

function getCurrentPlayer(state) {
  return state.get('players').find( player => {
    return player.get('currentUser');
  });
}

function getOriginalTileData(state, actionTile) {
  const tileFinder = tile => {
    return tile.get('id') === actionTile.id;
  };

  // First, figure out whether the tile is located on the board, swap or rack.
  let tileLookupPath;
  if ( state.get('rack').find(tileFinder) ) {
    tileLookupPath = ['rack'];
  } else if ( state.get('board').find(tileFinder) ) {
    tileLookupPath = ['board'];
  } else if ( state.get('swap').get('bucket').find(tileFinder) ) {
    tileLookupPath = ['swap', 'bucket'];
  } else {
    throw 'Cannot find the requested tile in any location';
  }

  const tileLocation = tileLookupPath[0];

  const [ tileIndex, tile ] = state.getIn(tileLookupPath).findEntry(tileFinder);

  return [ tile, tileIndex, tileLookupPath[0] ];
}

function createCopyOfTile(state, action, originalTile) {
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
  if ( action.tile.location === 'rack' && typeof action.tile.x === 'undefined' ) {
    newTile = newTile.set('x', state.get(action.tile.location).count());
  }

  return newTile;
}
