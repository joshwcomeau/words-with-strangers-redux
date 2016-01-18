import React    from 'react';

import Players            from './Players.jsx';
import Turns              from './Turns.jsx';
import TileSwap           from './TileSwap.jsx';

const SidePanel = ({
  players, turns, title, swap,
  isSwapActive, toggleSwapping,
  submitSwappedTiles, placeTile
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
      placeTile={placeTile}
    />

  </div>
);

export default SidePanel;
