import React      from 'react';

import Players    from './Players.jsx';
import Turns      from './Turns.jsx';
import TileSwap   from './TileSwap.jsx';

const SidePanel = (props) => (
  <div id="side-panel">
    <h4 className="side-panel-title">{props.title}</h4>
    <Players players={props.players} />
    <Turns players={props.players} turns={props.turns} />
    { generateTurnControls(props) }

  </div>
);

function generateTurnControls({
  swap, gameId, isSwapActive, toggleSwapping, submitSwappedTiles,
  status, passTurn, isMyTurn, pickTile, placeTile,
}) {
  if ( status === 'in_progress' ) {
    return (
      <div className="side-panel-turn-controls">
        <TileSwap
          swap={swap}
          isSwapActive={isSwapActive}
          toggleSwapping={toggleSwapping}
          submitSwappedTiles={submitSwappedTiles}
          pickTile={pickTile}
          placeTile={placeTile}
        />
        <div className="button-container pass-turn-container">
          <button
            className="button pass-turn"
            disabled={!isMyTurn}
            onClick={passTurn.bind(null, gameId)}
          >
          Pass Turn
          </button>
        </div>
      </div>
    );
  }
}

export default SidePanel;
