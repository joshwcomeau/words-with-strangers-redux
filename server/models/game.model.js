import _ from 'lodash';
import mongoose from 'mongoose';
import faker from 'faker';

import { createdAndUpdatedAt }  from './plugins';
import { fetchTiles }           from '../../common/lib/tiles.lib';
import { FULL_RACK_SIZE }       from '../../common/constants/config.constants';


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

gameSchema.methods.joinGame = function(player) {
  // Attach the player to the game
  this.players.push(player);

  // Give that player some starter tiles.
  this.replenishPlayerRack(player)
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

  console.log(`Replenishing rack for ${player.username}. Currently has ${numOfRackTiles} tiles, with a full rack size of ${FULL_RACK_SIZE}, so he needs ${numToRefill} more.`)

  this.rack = this.rack.concat( fetchTiles(player, numToRefill) );
}

gameSchema.virtual('roomName').get( function() {
  return `game_${this._id}`;
});


gameSchema.plugin(createdAndUpdatedAt, { index: true });

const Game = mongoose.model('Game', gameSchema)

export default Game;
