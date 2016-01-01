import _ from 'lodash';

export default function toJSON(schema) {
  schema.methods.toJSON = function() {
    let json = this.toObject();
    json.id = this.id;
    delete json._id;
    delete json.__v;
    return json;
  }
}

function recursivelyConvertIds(json) {
  for(key in json) {
    if ( typeof json[key] === 'object' ) {
      // This could be a regular object or an array.
      // If it's an array, recursively call it on the children
      // Otherwise, parse through properties, doing the _id -> id thing.
      // If any of the values are also objects, recursively call it on them.
    }
  }
}
