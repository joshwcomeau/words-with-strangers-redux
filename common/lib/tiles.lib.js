import * as _ from 'lodash';

function getRandomLetters(num) {
  return _.sample([
    'A','B','C','D','E','F','G','H','I','J','K','L','M',
    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
  ], num);
}

export function fetchTiles(player, num = 8) {
  const letters = getRandomLetters(num);
  return letters.map( (letter, index) => ({
    letter,
    points: _.sample([1,2,3,4,5,6,7,8,9,10]),
    playerId: player._id
  }))
}
