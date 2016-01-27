// A bunch of miscellaneous constants that are used around the app.
// Consolidated here.

// Game constants.
export const BOARD_SIZE               = 13;
export const FULL_RACK_SIZE           = 8;
export const POINTS_TO_WIN            = 200;


// How many milliseconds should a default flash message display for?
export const FLASH_MESSAGE_TIMEOUT    = 3000;

// When should we remove a game from the games list?
// This sets the number of hours it will persist for.
export const MINUTES_TO_SHOW_GAME     = 5 * 24 * 60;

// How many bonus squares should this game have?
export const BONUS_SQUARE_PERCENTAGES = [ 25, 35 ];

// An enumerated list of all possible game statuses.
export const GAME_STATUSES = {
  waiting:      'waiting',
  in_progress:  'in_progress',
  completed:    'completed',
  abandoned:    'abandoned',
};

// Convenience list of game status strings
export const GAME_STATUSES_ENUM = Object.keys(GAME_STATUSES);
