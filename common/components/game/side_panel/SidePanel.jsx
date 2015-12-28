import React from 'react';

import SidePanelPlayers from './SidePanelPlayers.jsx';
import SidePanelTurns   from './SidePanelTurns.jsx';

// TEMP
const SidePanel = ({ players, turns, title }) => (
  <div id="side-panel">
    <h4 className="side-panel-title">{title}</h4>
    <SidePanelPlayers players={players} />
    <SidePanelTurns players={players} turns={turns} />
  </div>
);

export default SidePanel;
