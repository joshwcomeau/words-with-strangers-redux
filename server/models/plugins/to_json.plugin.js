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
      memo.id = val.toString();
    }

    // Don't include __v
    else if ( key === '__v' ) {
      // Do nothing
    }

    // Convert any other fields holding objectIds to strings.
    else if ( val instanceof mongoose.Types.ObjectId ) {
      memo[key] = val.toString();
    }

    // If it's an array, we need to map each child to a converted version
    else if ( _.isArray(val) ) {
      memo[key] = val.map( valItem => {
        if ( typeof valItem === 'object' ) return recursivelyConvertIds(valItem)
        return valItem
      });
    }

    // Don't fuck with Date objects.
    else if ( val instanceof Date ) {
      memo[key] = val;
    }

    // If it's an embedded document, we need to process it as well
    else if ( typeof val === 'object' ) {
      memo[key] = recursivelyConvertIds(val);
    }

    // For all other values, just attach it as normal.
    else {
      memo[key] = val;
    }

    return memo;
  }, {});
}
