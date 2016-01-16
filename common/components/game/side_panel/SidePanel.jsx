import React    from 'react';

import Players            from './Players.jsx';
import Turns              from './Turns.jsx';
import TileSwapContainer  from './TileSwapContainer.jsx';

const SidePanel = ({
  players, turns, title, swap, toggleSwapping, submitSwappedTiles
}) => (
  <div id="side-panel">
    <h4 className="side-panel-title">{title}</h4>
    <Players players={players} />
    <Turns players={players} turns={turns} />
    <TileSwapContainer
      swap={swap}
      toggleSwapping={toggleSwapping}
      submitSwappedTiles={submitSwappedTiles}
    />

  </div>
);

export default SidePanel;
