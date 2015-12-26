import _ from 'lodash';
import mongoose from 'mongoose';
import faker from 'faker';

import { createdAndUpdatedAt }  from './plugins';
import { fetchTiles }           from '../../common/lib/tiles.lib';
import { FULL_RACK_SIZE }       from '../../common/constants/config.constants';

import { isTentative }          from '../../common/lib/game_logic.lib';


const Schema = mongoose.Schema;

const TileSchema = new Schema({
  playerId: { type: Schema.Types.ObjectId, required: true },
  turnId:   { type: Number },
  letter:   { type: String, required: true },
  points:   { type: Number, min: 1, max: 10, required: true },
  x:        { type: Number, min: 0},
  y:        { type: Number, min: 0}
});
TileSchema.plugin(createdAndUpdatedAt, { index: true });

const TurnSchema = new Schema({
  _id:      { type: Number, required: true },
  playerId: { type: Schema.Types.ObjectId, required: true },
  word:     { type: String, required: true },
  points:   { type: Number, min: 1, max: 250, required: true }
});
TurnSchema.plugin(createdAndUpdatedAt, { index: true });

const gameSchema = new Schema({
  title:            { type: String, default: 'Untitled Game' },
  createdByUserId:  { type: Schema.Types.ObjectId },
  players:          { type: [], default: [] },
  board:            { type: [TileSchema] },
  rack:             { type: [TileSchema] },
  turns:            { type: [TurnSchema] }
});

gameSchema.methods.join = function(player) {
  // Attach the player to the game
  this.players.push(player);

  // Give that player some starter tiles.
  this.replenishPlayerRack(player);

  // Return self, for chainability;
  return this;
}

gameSchema.methods.submitWord = function(tiles, user) {
  // TODO: Validations.
  // For now, we're just going to trust the client.

  // 1. Create a new Turn
  const word    = _.pluck( tiles, 'letter' ).join('');
  const points  = _.sum( tiles, tile => tile.points );
  const turnId  = this.turns.length;

  this.turns.push({
    word,
    points,
    _id: turnId,
    playerId: user._id
  });

  // 2. add to board.
  // Find all tentative tiles (not part of a previous turn),
  // add the new turnId to each new tile
  // push those tiles into the game.board.
  let tentativeTiles = tiles.filter( isTentative );
  tentativeTiles = tentativeTiles.map( tile => {
    tile.turnId = turnId;
    return tile;
  });

  tentativeTiles.forEach( tile => this.board.push(tile) );

  // 3. remove from rack
  // This is also pretty easy. We just need to delete these tiles
  // from the rack.
  tentativeTiles.forEach( tile => {
    this.rack.id(tile._id).remove()
  });

  // 4. Make sure the player gets some new tiles.
  this.replenishPlayerRack(user);

  return this;
}

gameSchema.methods.asSeenByUser = function(user = {}) {
  // Sends a copy of the game as viewed by a player.
  //   - They only have access to the tiles on the board or in THEIR rack.
  //     they don't receive the tiles in another player's rack
  //   - The player in the `players` array that corresponds with them is
  //     augmented with a `currentUser: true` flag.


  let game      = this.toJSON();
  game.rack     = game.rack.filter( tile => {
    return tile.playerId.toString() === user._id
  });
  game.players  = game.players.map( player => {
    if ( player._id === user._id ) player.currentUser = true;
    return player;
  });

  return game;
}

gameSchema.methods.replenishPlayerRack = function(player) {
  const playerId = mongoose.Types.ObjectId(player._id);
  const numOfRackTiles = _.filter(this.rack, { playerId }).length;
  const numToRefill = FULL_RACK_SIZE - numOfRackTiles;

  this.rack = this.rack.concat( fetchTiles(player, numToRefill) );
}

gameSchema.virtual('roomName').get( function() {
  return `game_${this._id}`;
});


gameSchema.plugin(createdAndUpdatedAt, { index: true });

const Game = mongoose.model('Game', gameSchema)

export default Game;
