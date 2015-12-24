import mongoose from 'mongoose';
import { createdAndUpdatedAt } from './plugins';

const Schema = mongoose.Schema;

const TileSchema = new Schema({
  playerId: { type: Schema.Types.ObjectId, required: true },
  gameId:   { type: Schema.Types.ObjectId, required: true },
  turnId:   { type: Schema.Types.ObjectId },
  letter:   { type: String, required: true },
  points:   { type: Number, min: 1, max: 10, required: true },
  x:        { type: Number, min: 0},
  y:        { type: Number, min: 0},
  location: { type: String, enum: ['board', 'rack'] }
});

const Tile = mongoose.model('Tile', TileSchema)

export default Tile;
