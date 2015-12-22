export default socket => store => next => action => {
  return next(action);
}
