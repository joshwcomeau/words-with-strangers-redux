import React    from 'react';
import _        from 'lodash';
import { Link } from 'react-router';
import moment   from 'moment';

const GamesListTableRow = React.createClass({
  formatStatus() {
    let status = this.props.game.status;
    return status.split('_').map(_.capitalize).join(' ');
  },
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
          {this.formatStatus()}
        </td>
        <td>
          <button className="button" onClick={this.joinGameClickHandler}>Join</button>
        </td>
      </tr>
    );
  }
});

export default GamesListTableRow;
