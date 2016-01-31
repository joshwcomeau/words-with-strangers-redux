import React, { PropTypes, Component }  from 'react';
import _                                from 'lodash';
import FlipMove                         from 'react-flip-move';

import Player from './Player.jsx'


class Players extends Component {
  static propTypes = {
    players: PropTypes.arrayOf(
      PropTypes.shape({
        id:       PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        points:   PropTypes.number.isRequired
      })
    ).isRequired,
  };

  render() {
    return (
      <div className="side-panel-players">
        <FlipMove duration="500">
          {
            this.props.players.map( player => (
              <Player key={player.id} {...player} />
            ))
          }
        </FlipMove>
      </div>
    );
  }
}

export default Players;
