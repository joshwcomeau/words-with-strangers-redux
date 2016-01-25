import React  from 'react';
import * as _ from 'lodash';

import { POINTS_TO_WIN } from '../../../constants/config.constants';

const Players = ({players}) => (
  <div className="side-panel-players">{renderPlayers(players)}</div>
);

function renderPlayers(players) {
  // Sort players by whoever's winning.
  players = _.sortBy(players, 'points').reverse();

  return players.map( (player) => {
    const percentage = Math.round((player.points / POINTS_TO_WIN) * 100);
    const styles = {
      width: percentage+"%"
    }

    return (
      <div className="side-panel-player" key={player.id}>
        <div className="player-data">
          <div className="avatar" style={{backgroundImage: `url('${player.profilePhoto}')`}}></div>
          <div className="username">{player.username}</div>
          <div className="points">{player.points}</div>
        </div>
        <div className="player-progress" style={styles}></div>
      </div>
    );
  });
}


export default Players;
