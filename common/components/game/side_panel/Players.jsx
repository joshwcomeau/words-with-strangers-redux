import React, { PropTypes } from 'react';
import _                    from 'lodash';

import Player from './Player.jsx'


const Players = ({players}) => (
  <div className="side-panel-players">
    {
      players
        .sort( (p1, p2) => p2.points - p1.points )
        .map( player => <Player key={player.id} {...player} /> )
    }
  </div>
);

Players.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id:       PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      points:   PropTypes.number.isRequired
    })
  ).isRequired,
};

export default Players;
