import { fromJS }     from 'immutable'
import { ADD_PLAYER } from '../constants/action.constants';

export const add_player = (player_data) => {
  return {
    type:   ADD_PLAYER,
    player: player_data
  }
}
