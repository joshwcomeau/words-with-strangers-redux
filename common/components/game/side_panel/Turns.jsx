import React  from 'react';
import * as _ from 'lodash';

const Turns = ({players, turns}) => (
  <div className="side-panel-turns">{renderTurns(players, turns)}</div>
);

function findPlayerById(playerId, players) {
  return _.find(players, {id: playerId});
}

function renderTurn(username, turn) {
  let suffix;
  if ( turn.pass ) {
    suffix = (
      <span className="turn-data turn-passed">
        { turn.passReason === 'swap' ? 'swapped.' : 'passed.' }
      </span>
    );
  } else {
    suffix = (
      <span>
        spelled&nbsp;
        <span className='turn-data turn-word'>{turn.word}</span>
        &nbsp;for&nbsp;
        <span className='turn-data turn-points'>{turn.points}</span>
        &nbsp;points.
      </span>
    );
  }

  return (
    <div className='side-panel-turn' key={turn.id}>
      <span className='turn-data turn-player-name'>
        {username}
        &nbsp;
        {suffix}
      </span>
    </div>
  );
}

function renderTurns(players, turns) {
  return turns.reverse().map( (turn) => {
    const username = findPlayerById(turn.playerId, players).username;

    return renderTurn(username, turn);
  });
}


export default Turns;
