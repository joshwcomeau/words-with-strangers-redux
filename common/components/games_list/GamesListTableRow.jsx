import React    from 'react';
import { Link } from 'react-router';
import moment   from 'moment';

const GamesListTableRow = React.createClass({
  joinGameClickHandler() {
    this.props.joinGame(this.props.game.id);
  },
  generatePlayerCell() {
    return this.props.game.players.map( player => (
      <a href="#" className="game-list-player clearfix" key={player.id}>
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
            <Link to={`/games/${game.id}`}>{game.title}</Link>
          </strong>
        </td>
        <td>{this.generatePlayerCell()}</td>
        <td>{moment(game.createdAt).format('MMM Do, h:mm a')}</td>
        <td>
          {game.status}
        </td>
        <td>
          <button onClick={this.joinGameClickHandler}>Join Game</button>
        </td>
      </tr>
    );
  }
});

export default GamesListTableRow;
