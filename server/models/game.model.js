import mongoose from 'mongoose';

import { setDatesOnSave } from './model_helpers';

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  username:     { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  profilePhoto: { type: String },
  createdAt:    Date,
  updatedAt:    Date
});

gameSchema.methods.joinGame = function(user, callback) {
  console.log("User", user, "joining game", this);
}

gameSchema.pre('save', setDatesOnSave);

const Game = mongoose.model('Game', gameSchema)

export default Game;
