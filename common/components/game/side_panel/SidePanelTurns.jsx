import React  from 'react';
import * as _ from 'lodash';

const SidePanelTurns = ({players, turns}) => (
  <div className="side-panel-turns">{renderTurns(players, turns)}</div>
);

function findPlayerById(playerId, players) {
  return _.find(players, {_id: playerId})
}

function renderTurns(players, turns) {
  return turns.reverse().map( (turn) => (
    <div className='side-panel-turn' key={turn._id}>
      <span className='turn-data turn-player-name'>
        {findPlayerById(turn.playerId, players).username}
      </span>
      &nbsp;spelled&nbsp;
      <span className='turn-data turn-word'>{turn.word}</span>
      &nbsp;for&nbsp;
      <span className='turn-data turn-points'>{turn.points}</span>
      &nbsp;points.
    </div>
  ));
}


export default SidePanelTurns;
