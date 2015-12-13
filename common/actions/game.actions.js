import { ADD_TILES_TO_RACK } from '../constants/actions.constants';
import { fetchTiles }         from '../lib/tiles.lib';

export function addTilesToRack(num) {
  return {
    type:   ADD_TILES_TO_RACK,
    tiles:  fetchTiles(num)
  }
}
