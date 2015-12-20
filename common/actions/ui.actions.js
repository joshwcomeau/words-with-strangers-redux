import {
  OPEN_MENU,
  CLOSE_MENU,
  SET_AND_DISPLAY_FLASH,
  DISMISS_FLASH
} from '../constants/actions.constants';

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

export function setAndDisplayFlash(flashType, message) {
  return {
    type: CLOSE_MENU,
    flashType,
    message
  }
}

export function dismissFlash() {
  return {
    type: DISMISS_FLASH
  }
}
