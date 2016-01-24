import _ from 'lodash';
import mongoose from 'mongoose';

import { createdAndUpdatedAt }  from '../plugins';

const Schema = mongoose.Schema;


const TurnSchema = new Schema({
  id:         { type: Number, required: true },
  playerId:   { type: Schema.Types.ObjectId, required: true },
  word:       { type: String },
  points:     { type: Number, min: 0, max: 300, required: true },
  pass:       { type: Boolean, required: false },
  passReason: { type: String, enum: ['pass', 'swap'] }
});
TurnSchema.plugin(createdAndUpdatedAt, { index: true });


export default TurnSchema;
