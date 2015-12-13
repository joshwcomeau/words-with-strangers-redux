import React  from 'react';
import * as _ from 'lodash';

const SidePanelTurns = ({players, turns}) => (
  <div className="side-panel-turns">{renderTurns(turns)}</div>
);

function renderTurns(turns) {
  // TODO
  turns = [];

  // Sort players by whoever's winning.
  return turns.map( (turn) => (
    <div className='side-panel-turn' key={turn._id}>
      <span className='turn-data turn-player-name'>{players[turn.playerId].username}</span>
      &nbsp;spelled&nbsp;
      <span className='turn-data turn-word'>{turn.word}</span>
      &nbsp;for&nbsp;
      <span className='turn-data turn-points'>{turn.points.total}</span>
      &nbsp;points.
    </div>
  ));
}


export default SidePanelTurns;
