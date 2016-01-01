import _ from 'lodash';
import mongoose from 'mongoose';

export default function toJSON(schema) {
  schema.methods.toJSON = function() {
    return recursivelyConvertIds( this.toObject() );
  }
}

export function recursivelyConvertIds(json) {
  return _.reduce(json, (memo, val, key) => {
    // If this field is our `_id` field, take the `id` instead.
    if ( key === '_id' ) {
      memo.id = val.id;
    }

    // Don't include __v
    else if ( key === '__v' ) {
      // Do nothing
    }

    // Convert any other fields holding objectIds to strings.
    else if ( val instanceof mongoose.Types.ObjectId ) {
      memo[key] = val.toString();
    }

    // For all other values, just attach it as normal.
    else {
      memo[key] = val;
    }

    return memo;
  }, {});
}
