import { List, Map, fromJS } from 'immutable';

export function immu_pluck(list, fieldName) {
  // First, ensure data is correct
  if ( !(list instanceof List) ) {
    throw new Error('The data you provide must be an immutable List.');
  }
  if ( typeof fieldName !== 'string' ) {
    throw new Error('Please provide a single field name (eg. "_id") to pluck out of each Map in the List.');
  }


  return list.map( (listItem, index) => {
    if ( !(listItem instanceof Map) ) {
      console.warn(`You supplied a ${typeof listItem} to immu_pluck, when we were expecting a bunch of immutable Maps. We're returning undefined at index ${index}`)
    }
    return listItem.get(fieldName)
  });

}
