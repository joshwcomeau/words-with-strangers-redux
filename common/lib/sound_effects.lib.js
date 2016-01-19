import { Howl } from 'howler';


let soundEffects = {};

// Only bother loading sounds on clients
if ( process.env.UNIVERSAL_ENV === 'client' ) {
  const s3Url = "https://s3.amazonaws.com/wordswithstrangers/sounds";

  const sounds = {
    place_tile:        new Howl({ urls: [`${s3Url}/place_tile.mp3`] }),
    pick_tile:         new Howl({ urls: [`${s3Url}/pick_tile.mp3`] }),
    game_win:          new Howl({ urls: [`${s3Url}/game_win.mp3`] }),
    game_lose:         new Howl({ urls: [`${s3Url}/game_lose.mp3`] }),
    turn_notification: new Howl({ urls: [`${s3Url}/turn_notification.mp3`] })
  };

  soundEffects.play = soundName => sounds[soundName].play();
}


export default soundEffects;
