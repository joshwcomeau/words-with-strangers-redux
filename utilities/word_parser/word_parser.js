'use strict';
/*
Word Parser.
Takes a comma-separated list of dictionary words as input, and generates
a json file where the key is an alphabet letter, and the value is an array
of words that start with this letter. eg:

{
  a: ['aadvark', 'apple', ...],
  b: ['baa', basketball', ...],
  ...
  z: ['zebra', ...]
}
*/

let fs = require('fs');
let _  = require('lodash');

main();

function main() {
  const INPUT_PATH  = './input_words.txt';
  const OUTPUT_PATH = './common/data/words.json';
  const wordText    = fs.readFileSync(INPUT_PATH, 'utf8');
  const wordArray   = buildWordArray(wordText);

  const outputJson  = JSON.stringify( buildOutputJson(wordArray) );

  const error       = fs.writeFileSync(OUTPUT_PATH, outputJson);

  console.log(error ? `ERROR: ${error}` : 'Success!')
}

function buildWordArray(wordText) {
  // Ensure no trailing newline, no trailing comma, no undefined words.
  wordText = wordText.replace('\n', '').replace(/\,$/, '');
  return _.compact(wordText.split(','));
}

function buildOutputJson(wordArray) {
  let output = {};
  let firstLetter;

  wordArray.forEach( word => {
    firstLetter = word[0];

    // Create the array for this letter, if it doesn't already exist.
    if ( !(firstLetter in output) )
      output[firstLetter] = [];

    output[firstLetter].push(word)
  });

  return output;
}
