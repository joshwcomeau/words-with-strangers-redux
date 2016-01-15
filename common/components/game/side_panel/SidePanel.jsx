import React    from 'react';

import Players  from './Players.jsx';
import Turns    from './Turns.jsx';

// TEMP
const SidePanel = ({ players, turns, title }) => (
  <div id="side-panel">
    <h4 className="side-panel-title">{title}</h4>
    <Players players={players} />
    <Turns players={players} turns={turns} />
  </div>
);

export default SidePanel;
