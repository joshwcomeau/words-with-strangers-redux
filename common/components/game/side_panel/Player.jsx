import React  from 'react';
import * as _ from 'lodash';

import { POINTS_TO_WIN } from '../../../constants/config.constants';


const Player = ({ username, profilePhoto, points }) => {
  const percentage = Math.round((points / POINTS_TO_WIN) * 100);
  const styles = {
    width: percentage+"%"
  }

  return (
    <div className="side-panel-player">
      <div className="player-data">
        <div className="avatar" style={{backgroundImage: `url('${profilePhoto}')`}} />
        <div className="username">{username}</div>
        <div className="points">{points}</div>
      </div>
      <div className="player-progress" style={styles} />
    </div>
  );
};

export default Player;
