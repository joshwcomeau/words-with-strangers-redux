import React    from 'react';
import { Link } from 'react-router';
import moment   from 'moment';

const GamesListTableRow = React.createClass({
  joinGame() {
    console.log("Attempted to join game");
  },
  generatePlayerCell() {
    return this.props.game.players.map( player => (
      <a href="#" className="game-list-player clearfix" key={player._id}>
        <div className="player-avatar" style={{
          backgroundImage: `url('${player.profilePhoto}')`
        }}></div>
        {player.username}
      </a>
    ));
  },
  render() {
    let game = this.props.game;
    return (
      <tr>
        <td>
          <strong>
            <Link to={`/games/${game._id}`}>{game.title}</Link>
          </strong>
        </td>
        <td>{this.generatePlayerCell()}</td>
        <td>{moment(game.createdAt).format('MMM Do, h:mm a')}</td>
        <td>
          {game.status}
        </td>
        <td>
          <button onClick={this.joinGame}>Join Game</button>
        </td>
      </tr>
    );
  }
});

export default GamesListTableRow;
