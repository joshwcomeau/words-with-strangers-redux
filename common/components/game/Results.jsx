import React    from 'react';
import { Link } from 'react-router';
import _        from 'lodash';

const Results = ({ isWinner }) => (
  <div id="results" className="modal">
    <div className="modal-outer">
      <div className="modal-inner">
        { isWinner ? generateWin() : generateLose() }
      </div>
    </div>
  </div>
);

function generateWin() {
  return (
    <div className="win">
      <img src="https://s3.amazonaws.com/wordswithstrangers/win.png" />
      <h2>You win!</h2>
      <p>You did it, you wordy son of a gun! Your vocabulary is unequaled, unparalleled, unrivaled and unsurpassed.</p>
      <Link className="button" to="/">Return to Games List</Link>
    </div>
  );
}

function generateLose() {
  return (
    <div className="lose">
      <img src="https://s3.amazonaws.com/wordswithstrangers/lose.png" />
      <h2>Dammit.</h2>
      <p>Afraid to say it, but your opponent out-worded you this time. Don't be discouraged! You'll get them next time.</p>
      <Link className="button" to="/">Return to Games List</Link>
    </div>
  );
}

export default Results;
