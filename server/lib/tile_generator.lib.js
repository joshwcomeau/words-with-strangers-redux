import * as _ from 'lodash';

// Stealing the default distribution from Scrabble.
// The number is how many of each letter exists in a full set.
// You are much more likely to generate an A than a B, for example.
const distributionObject = {
  A: 9,  B: 2,  C: 2,  D: 4,  E: 12, F: 2,
  G: 3,  H: 2,  I: 9,  J: 1,  K: 1,  L: 4,
  M: 2,  N: 6,  O: 8,  P: 2,  Q: 1,  R: 6,
  S: 4,  T: 6,  U: 4,  V: 2,  W: 2,  X: 1,
  Y: 2,  Z: 1
};

// The base point values for a given letter.
// Because this is my game and I can do whatever I want, I'll be
// introducing a degree of randomness, so these values aren't absolute.
const pointsObject = {
  A: 1,  B: 3,  C: 3,  D: 2,  E: 1,  F: 4,
  G: 2,  H: 4,  I: 1,  J: 8,  K: 5,  L: 1,
  M: 3,  N: 1,  O: 1,  P: 3,  Q: 10, R: 1,
  S: 1,  T: 1,  U: 1,  V: 4,  W: 4,  X: 8,
  Y: 4,  Z: 10
};

const distributionArray = generateDistributionArray(distributionObject);


// This function generates an array with each letter repeated N times, where
// N is its distribution in _letterDistribution.
// eg. [A,A,A,A,A,A,A,A,A, B,B, C,C ...]
function generateDistributionArray(distributionObject) {
  const distributionLetters = _.keys(distributionObject)
  let generatedArray = [];

  distributionLetters.forEach( letter => {
    _.times( distributionObject[letter], () => generatedArray.push(letter) );
  });

  return generatedArray;
}

function getPointValueForLetter(letter) {
  // For fun, we're introducing some randomness into point values.
  // Letters still have a base point value, and that can be altered by
  // +/- 2 points.
  let baseValue = pointsObject[letter];

  let adjustment = _.sample([-2, -1, 0, 1, 2])

  let total = baseValue + adjustment;

  if ( total > 10 ) total = 10;
  if ( total < 1  ) total = 1;

  return total;
}

export default function generateTiles(playerId, num = 8) {
  let letters = _.sampleSize(distributionArray, num)

  return letters.map( letter => ({
    letter,
    playerId,
    points: getPointValueForLetter(letter)
  }));
}
