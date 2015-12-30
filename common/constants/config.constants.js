// A bunch of miscellaneous constants that are used around the app.
// Consolidated here.

export const BOARD_SIZE             = 13;
export const FULL_RACK_SIZE         = 8;
export const FLASH_MESSAGE_TIMEOUT  = 6000;

export const GAME_STATUSES_ENUM     = [
  'waiting',
  'in_progress',
  'completed',
  'abandoned'
];
export const GAME_STATUSES          = {
  waiting:      GAME_STATUSES_ENUM[0],
  in_progress:  GAME_STATUSES_ENUM[1],
  completed:    GAME_STATUSES_ENUM[2],
  abandoned:    GAME_STATUSES_ENUM[3],
};
