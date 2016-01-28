import React, { PropTypes, Component }  from 'react';
import _                                from 'lodash';

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

  componentWillReceiveProps(nextProps) {
    if ( _.isEmpty(this.props.players) ) {
      console.log(this.props, nextProps)
      return;
    }

    // If the winning player has switched, we want to animate that transition.

    console.log("First player", this.props.players[0].username, nextProps.players[0].username);
  }

  render() {
    return (
      <div className="side-panel-players">
        {
          this.props.players.map( player => (
            <Player key={player.id} {...player} />
          ))
        }
      </div>
    );
  }
}

export default Players;
