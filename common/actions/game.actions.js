import { GENERATE_NEW_TILES } from '../constants/actions';
import { fetchTiles }         from '../lib/tiles';

export function generate_new_tiles(value) {
  return {
    type: GENERATE_NEW_TILES
  }
}
