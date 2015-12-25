import * as _ from 'lodash';

import Game from '../models/game.model';

import {
  SUBSCRIBE_TO_GAME,
  UPDATE_GAME_STATE,
  SUBMIT_WORD
} from '../../common/constants/actions.constants';


export default function(io) {
  let gameIo = io.of('/game');

  gameIo.on('connection', (socket) => {
    socket.on(SUBSCRIBE_TO_GAME, (data) => {
      socket.join(`game_${data.gameId}`);

      // Send down the initial game data.
      Game.findById(data.gameId, (err, game) => {
        if (err ) return console.log("Error finding game", err);
        if ( !game ) return console.log("No game found with ID", data.gameId);
        socket.emit(UPDATE_GAME_STATE, game.asSeenByUser(data.auth.user))
      })
    });

    socket.on(SUBMIT_WORD, (data) => {
      // TODO: Validations.
      // For now, we're just going to trust the client.

      Game.findById(data.gameId, (err, game) => {
        // 1. Create a new Turn
        const word    = _.pluck( data.tiles, 'letter' ).join('');
        const points  = _.sum( data.tiles, tile => tile.points );
        const turnId  = game.turns.length;
        game.turns.push({
          word,
          points,
          _id: turnId,
          playerId: data.auth.user._id
        });

        // 2. add to board.
        // Find all 'new' tiles (not part of a previous turn),
        // add the new turnId to each new tile
        // push those tiles into the game.board.
        let newTiles = data.tiles.filter( tile => !tile.turnId );
        newTiles = newTiles.map( tile => {
          tile.turnId = turnId;
          return tile;
        });

        newTiles.forEach( tile => game.board.push(tile) );

        // 3. remove from rack
        // This is also pretty easy. We just need to delete these tiles
        // from the rack.
        game.rack.forEach( tile => game.rack.id(tile._id).remove() );

        // Bam! Time to save the game, and broadcast a change.
        game.save( (err) => {
          // TODO: error handling
          if (err) return console.error("OH NO!!!", err);

          socket.emit(UPDATE_GAME_STATE, game.asSeenByUser(data.auth.user))
        });

      });
    });
  });
}
