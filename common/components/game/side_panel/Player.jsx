import React, { Component }  from 'react';
import * as _ from 'lodash';

import { POINTS_TO_WIN } from '../../../constants/config.constants';

// Can't make this guy a stateless functional component because MagicMove
// needs to use its refs.
class Player extends Component {
  calculateProgressStyle() {
    // Using transform:scale instead of width, for 60+fps goodness.
    const scale = (this.props.points / POINTS_TO_WIN);
    return { transform: `scaleX(${scale})` };
  }
  render() {
    const { username, profilePhoto, points } = this.props;

    return (
      <div className="side-panel-player">
        <div className="player-data">
          <div className="avatar" style={{backgroundImage: `url('${profilePhoto}')`}} />
          <div className="username">{username}</div>
          <div className="points">{points}</div>
        </div>
        <div className="player-progress" style={this.calculateProgressStyle()} />
      </div>
    );
  }
}

export default Player;
