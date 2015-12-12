import { GENERATE_NEW_TILES } from '../constants/actions.constants';
import { fetchTiles }         from '../lib/tiles.lib';

export function generate_new_tiles(num) {
  return {
    type: GENERATE_NEW_TILES,
    payload: {
      tiles: fetchTiles(num)
    }
  }
}
