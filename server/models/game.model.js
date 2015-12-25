import _ from 'lodash';
import mongoose from 'mongoose';
import faker from 'faker';

import { createdAndUpdatedAt }  from './plugins';
import { fetchTiles }           from '../../common/lib/tiles.lib';


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

gameSchema.methods.joinGame = function(player, saveGame = false) {
  // Attach the player to the game
  this.players.push(player);

  // Give that player some starter tiles.
  this.generateTiles(player)

  console.log("Finished joining game!", this, this.tiles, typeof this.tiles)

}

gameSchema.methods.asSeenByPlayer = function(player) {
  // Sends a copy of the game as viewed by a player.
  // eg. don't include the tiles in another player's rack.

  let game = this.toJSON();
  game.rack = _.filter(game.rack, (tile) => tile.playerId !== player._id );
  return game;
}

gameSchema.methods.generateTiles = function(player) {
  this.rack = this.rack.concat( fetchTiles(player) );
}


gameSchema.plugin(createdAndUpdatedAt, { index: true });

const Game = mongoose.model('Game', gameSchema)

export default Game;
