import React      from 'react';

import Players    from './Players.jsx';
import Turns      from './Turns.jsx';
import TileSwap   from './TileSwap.jsx';

const SidePanel = ({
  players, turns, title, swap, gameId,
  isSwapActive, toggleSwapping, submitSwappedTiles,
  passTurn, isMyTurn, pickTile, placeTile,
}) => (
  <div id="side-panel">
    <h4 className="side-panel-title">{title}</h4>
    <Players players={players} />
    <Turns players={players} turns={turns} />
    <TileSwap
      swap={swap}
      isSwapActive={isSwapActive}
      toggleSwapping={toggleSwapping}
      submitSwappedTiles={submitSwappedTiles}
      pickTile={pickTile}
      placeTile={placeTile}
    />
    { generatePassTurnButton(passTurn, gameId, isMyTurn) }
  </div>
);

function generatePassTurnButton(passTurn, gameId, isMyTurn) {
  return (
    <div className="button-container pass-turn-container">
      <button
        className="button pass-turn"
        disabled={!isMyTurn}
        onClick={passTurn.bind(null, gameId)}
      >
      Pass Turn
      </button>
    </div>
  );
}
export default SidePanel;
