import React  from 'react';
import * as _ from 'lodash';

const SidePanelPlayers = ({players}) => (
  <div className="side-panel-players">{renderPlayers(players)}</div>
);

function renderPlayers(players) {
  // Sort players by whoever's winning.
  players = _.sortBy(players, 'points').reverse();

  return players.map( (player) => {
    return (
      <div className="side-panel-player" key={player.id}>
        <div className="avatar" style={{backgroundImage: `url('${player.profilePhoto}')`}}></div>
        <div className="username">{player.username}</div>
        <div className="points">{player.points}</div>
      </div>
    );
  });
}


export default SidePanelPlayers;
