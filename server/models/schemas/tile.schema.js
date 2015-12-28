import _ from 'lodash';
import mongoose from 'mongoose';

import { createdAndUpdatedAt }  from '../plugins';

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

// TODO: Add an isEstablished / isTentative virtual property to tiles?

export default TileSchema;
