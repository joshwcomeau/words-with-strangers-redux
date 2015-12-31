import React  from 'react';
import * as _ from 'lodash';

const Controls = ({
  isMyTurn, isValidPlacement, submitWord, shuffleRack, recallTilesToRack
}) => (
  <div id="controls" className={isMyTurn ? 'my-turn' : 'their-turn'}>
    <div className="turn-indicator">{isMyTurn ? 'Your Turn' : 'Their Turn'}</div>
    <div className="submit-word-container">
      <button
      className="button submit-word"
      disabled={!isValidPlacement || !isMyTurn}
      onClick={submitWord}
      >
        Submit Word
      </button>

    </div>
    <div className="other-actions-container">
      <button onClick={shuffleRack}>
        <i className="fa fa-random"></i>
      </button>
      <button onClick={recallTilesToRack}>
        <i className="fa fa-undo"></i>
      </button>
    </div>
  </div>
);

export default Controls;
