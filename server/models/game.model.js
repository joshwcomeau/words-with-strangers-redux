import mongoose from 'mongoose';
import faker from 'faker';

import { createdAndUpdatedAt } from './plugins';

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  title:            { type: String, default: 'Untitled Game' },
  createdByUserId:  { type: Schema.Types.ObjectId },
  players:          { type: [], default: [] }
});

gameSchema.methods.joinGame = function(user, saveGame = false) {
  // TODO: Refine this.
  this.players.push(user);
}

gameSchema.plugin(createdAndUpdatedAt, { index: true });

const Game = mongoose.model('Game', gameSchema)

export default Game;
