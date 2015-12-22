export default function logger(store) {
  return next => action => {
    // If action is a function, instead of an object, it means this is a
    // thunk, and it's about to dispatch further actions.
    const isThunk   = typeof action === 'function';
    const groupName = isThunk ? 'Thunk' : action.type;

    console.group( groupName );

    if ( !isThunk ) console.info('dispatching', action);

    let result = next(action);

    let loggedState = store.getState().toJS();
    console.log( (isThunk ? 'Final state' : 'Next state'), loggedState );

    console.groupEnd( groupName );
    return result;
  };
}
