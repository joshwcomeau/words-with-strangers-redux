// A bunch of miscellaneous constants that are used around the app.
// Consolidated here.

// Game constants. How many tiles make up the board and the rack
export const BOARD_SIZE             = 13;
export const FULL_RACK_SIZE         = 8;

// How many milliseconds should a default flash message display for?
export const FLASH_MESSAGE_TIMEOUT  = 3000;

// When should we remove a game from the games list?
// This sets the number of hours it will persist for.
export const MINUTES_TO_SHOW_GAME   = 5 * 24 * 60;

// An enumerated list of all possible game statuses.
export const GAME_STATUSES_ENUM     = [
  'waiting',
  'in_progress',
  'completed',
  'abandoned'
];
// Convenience helper for grabbing statuses from the enumerated list.
export const GAME_STATUSES          = {
  waiting:      GAME_STATUSES_ENUM[0],
  in_progress:  GAME_STATUSES_ENUM[1],
  completed:    GAME_STATUSES_ENUM[2],
  abandoned:    GAME_STATUSES_ENUM[3],
};
