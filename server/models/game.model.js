import mongoose from 'mongoose';

import { createdAndUpdatedAt } from './plugins';

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  username:     { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  profilePhoto: { type: String }
});

gameSchema.methods.joinGame = function(user, callback) {
  console.log("User", user, "joining game", this);
}

gameSchema.plugin(createdAndUpdatedAt, { index: true });

const Game = mongoose.model('Game', gameSchema)

export default Game;
