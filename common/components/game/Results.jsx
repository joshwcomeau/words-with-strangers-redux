import React  from 'react';
import _      from 'lodash';

const Results = ({ isWinner }) => (
  <div className="results-container">
    <div className="results">
      { isWinner ? generateWin() : generateLose() }
    </div>
  </div>
);

function generateWin() {
  return (
    <div className="win">
      <img src="https://s3.amazonaws.com/wordswithstrangers/win.png" />
      <h2>You win!</h2>
      <p>You did it, you wordy son of a gun! Your vocabulary is without equal.</p>
    </div>
  );
}

function generateLose() {
  return (
    <div className="lose">
      <img src="https://s3.amazonaws.com/wordswithstrangers/lose.png" />
      <h2>Dammit.</h2>
      <p>Afraid to say it, but your opponent out-worded you this time. Don't be discouraged! You'll get them next time.</p>
    </div>
  );
}

export default Results;
