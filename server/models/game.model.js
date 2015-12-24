import _ from 'lodash';
import mongoose from 'mongoose';
import faker from 'faker';

import { createdAndUpdatedAt }  from './plugins';
import { fetchTiles }           from '../../common/lib/tiles.lib';


const Schema = mongoose.Schema;

const TileSchema = new Schema({
  playerId: { type: Schema.Types.ObjectId, required: true },
  turnId:   { type: Schema.Types.ObjectId },
  letter:   { type: String, required: true },
  points:   { type: Number, min: 1, max: 10, required: true },
  x:        { type: Number, min: 0},
  y:        { type: Number, min: 0},
  location: { type: String, enum: ['board', 'rack'] }
});

const gameSchema = new Schema({
  title:            { type: String, default: 'Untitled Game' },
  createdByUserId:  { type: Schema.Types.ObjectId },
  players:          { type: [], default: [] },
  tiles:            { type: [TileSchema] }
});

gameSchema.virtual('board').get( function() {
  return _.filter(this.tiles, { location: 'board' });
});

gameSchema.virtual('rack').get( function() {
  return _.filter(this.tiles, { location: 'rack' });
});

gameSchema.methods.joinGame = function(player, saveGame = false) {
  // Attach the player to the game
  this.players.push(player);

  // Give that player some starter tiles.
  this.generateTiles(player)

  console.log("Finished joining game!", this, this.tiles, typeof this.tiles)

}

gameSchema.methods.generateTiles = function(player) {
  this.tiles = this.tiles.concat( fetchTiles(player) );
  console.log("After concat", this.tiles)
}


gameSchema.plugin(createdAndUpdatedAt, { index: true });
TileSchema.plugin(createdAndUpdatedAt, { index: true });

const Game = mongoose.model('Game', gameSchema)

export default Game;
