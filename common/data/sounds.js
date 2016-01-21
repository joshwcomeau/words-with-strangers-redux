const s3Url = "https://s3.amazonaws.com/wordswithstrangers/sounds";

const sounds = {
  place_tile:        `${s3Url}/place_tile.mp3`,
  pick_tile:         {
    volume: 0.5,
    urls: [`${s3Url}/pick_tile.mp3`],
  },
  game_win:          `${s3Url}/game_win.mp3`,
  game_lose:         `${s3Url}/game_lose.mp3`,
  turn_notification: `${s3Url}/turn_notification.mp3`
};

export default sounds;
