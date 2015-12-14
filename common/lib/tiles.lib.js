import * as _ from 'lodash';

function getRandomLetters(num) {
  return _.sample([
    'A','B','C','D','E','F','G','H','I','J','K','L','M',
    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
  ], num);
}

export function fetchTiles(num) {
  console.log("Generating", num, "tiles")
  const letters = getRandomLetters(num);
  return letters.map( (letter, index) => {
    return {
      _id: Math.round(Math.random() * 100000),
      letter,
      points: 1,
      x: index
    }
  })
}
