// Catch events that need to be replicated on the server (eg. submitting words)
// and emit an event on the socket.

export default socket => store => next => action => {
  // Ignore actions that haven't specified this socket in the metadata
  if ( !action.meta || action.meta.remote !== socket.nsp ) {
    return next(action);
  }

  // We'll want to merge in the user details,
  // so that the server will know who is sending this action.
  let auth = store.getState().toJS().auth;
  let payload = _.extend({}, action, {auth});

  socket.emit(action.type, payload);

  return next(action);
}
