import * as _ from 'lodash';

function getRandomLetters(num) {
  return _.sample([
    'A','B','C','D','E','F','G','H','I','J','K','L','M',
    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
  ], num);
}

export function fetchTiles(num) {
  const letters = getRandomLetters(num);
  return letters.map( (letter, index) => {
    return {
      letter,
      points: 1,
      x: index
    }
  })
}
