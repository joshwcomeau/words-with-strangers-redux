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
  generateActionCell() {
    if ( this.props.game.status !== 'waiting' ) return null;
    if ( !this.props.authenticated ) return (
      <button className="button disabled" disabled>Log in to join</button>
    );

    return (
      <button className="button" onClick={this.joinGameClickHandler}>
        Join
      </button>
    );
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
        <td>{this.generateActionCell()}</td>
      </tr>
    );
  }
});

export default GamesListTableRow;
