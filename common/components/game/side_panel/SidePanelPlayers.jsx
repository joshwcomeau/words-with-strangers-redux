import React  from 'react';
import * as _ from 'lodash';

const SidePanelPlayers = ({players}) => (
  <div className="side-panel-players">{renderPlayers(players)}</div>
);

function renderPlayers(players) {
  // fake data, for now
  players = [{
    _id: '1',
    profilePhoto: 'https://pbs.twimg.com/profile_images/378800000532546226/dbe5f0727b69487016ffd67a6689e75a.jpeg',
    username: 'BestWorderEvah',
    points: 3
  }, {
    _id: '2',
    profilePhoto: 'http://cdn2.business2community.com/wp-content/uploads/2014/10/Sushi-Cat-Halloween-Costume2.jpg2.jpg',
    username: 'SushiCat',
    points: 8
  }]

  // Sort players by whoever's winning.
  players = _.sortBy(players, 'points').reverse();

  return players.map( (player) => {
    return (
      <div className="side-panel-player" key={player._id}>
        <div className="avatar" style={{backgroundImage: `url('${player.profilePhoto}')`}}></div>
        <div className="username">{player.username}</div>
        <div className="points">{player.points}</div>
      </div>
    );
  });
}


export default SidePanelPlayers;
