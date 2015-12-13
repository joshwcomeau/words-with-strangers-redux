import { List, fromJS }             from 'immutable';


export default function game(state = List(), action) {
  switch (action.type) {
    case ADD_PLAYER:
      return state.push( action.player );
    default:
      return state
  }
}
