const s3Url = "https://s3.amazonaws.com/wordswithstrangers/sounds";

const sounds = {
  game: {
    urls: [`${s3Url}/wws_sprite.mp3`],
    sprite: {
      pickTile:         [500, 20],
      placeTile:        [600, 20],
      turnNotification: [700, 740],
      win:              [1500, 2500],
      lose:             [4000, 2450],
      drawerOpen:       [6500, 600],
      drawerClose:      [7500, 400],
      playerEnter:      [8000, 650],
      completeTurn:     [8650, 800]
    }
  }
};

export default sounds;
