import _ from 'lodash';
import mongoose from 'mongoose';

import { createdAndUpdatedAt }  from '../plugins';

const Schema = mongoose.Schema;


const TurnSchema = new Schema({
  id:       { type: Number, required: true },
  playerId: { type: Schema.Types.ObjectId, required: true },
  word:     { type: String, required: true },
  points:   { type: Number, min: 1, max: 250, required: true },
  pass:     { type: Boolean, required: false }
});
TurnSchema.plugin(createdAndUpdatedAt, { index: true });


export default TurnSchema;
