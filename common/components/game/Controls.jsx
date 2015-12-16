import React  from 'react';
import * as _ from 'lodash';

const Controls = ({isMyTurn, isValidTurn, submitWord}) => (
  <div id="controls" className={isMyTurn ? 'my-turn' : 'their-turn'}>
    <div className="turn-indicator">{isMyTurn ? 'Your Turn' : 'Their Turn'}</div>
    <div className="submit-word-container">
      <button
      className="button submit-word"
      disabled={!isValidTurn}
      onClick={submitWord}
      >
        Submit Word
      </button>
    </div>
    <div className="other-actions-container">
      <button>
        <i className="fa fa-random"></i>
      </button>
      <button>
        <i className="fa fa-undo"></i>
      </button>
    </div>
  </div>
);

export default Controls;
