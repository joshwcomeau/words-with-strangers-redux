import {
  OPEN_MENU,
  CLOSE_MENU,
  SET_AND_DISPLAY_FLASH,
  DISMISS_FLASH
} from '../constants/actions.constants';
import { FLASH_MESSAGE_TIMEOUT } from '../constants/config.constants.js';


export function openMenu(menu) {
  return {
    type: OPEN_MENU,
    menu
  };
}

export function closeMenu() {
  return {
    type: CLOSE_MENU
  }
}

export function updateFlashMessage(message, type, timeout = FLASH_MESSAGE_TIMEOUT) {
  return (dispatch, getState) => {
    // First, immediately dispatch the SET_AND_DISPLAY_FLASH event.
    dispatch({
      type: SET_AND_DISPLAY_FLASH,
      flash: {
        type,
        message
      }
    });

    // Then, after a delay, remove it.
    setTimeout( () => {
      dispatch({ type: DISMISS_FLASH });
    }, timeout);
  }

}

export function dismissFlash() {
  return {
    type: DISMISS_FLASH
  }
}
