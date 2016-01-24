import React    from 'react';
import _        from 'lodash';
import { Link } from 'react-router';
import moment   from 'moment';

const GamesListTableRow = React.createClass({
  isAuthUserAPlayer() {
    const { game, authUser } = this.props;
    if ( !authUser ) return false;
    return game.players.find( player => player.id === authUser.id )
  },
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
    const { game, authenticated, authUser } = this.props;

    // If the game isn't waiting, the "action" is just a link to the game.
    // The text will depend on whether the authUser is in the game or not.
    if ( game.status !== 'waiting' ) {
      const linkText = this.isAuthUserAPlayer() ? 'Resume' : 'Spectate';
      return (
        <Link className="button" to={`/games/${game.id}`}>{linkText}</Link>
      );
    }

    if ( !authenticated ) {
      return (
        <button className="button" disabled>Login to join</button>
      );
    } else if ( this.isAuthUserAPlayer() ) {
      return (
        <Link className="button" to={`/games/${game.id}`}>Resume</Link>
      );
    } else {
      return (
        <button className="button" onClick={this.joinGameClickHandler}>
          Join
        </button>
      );
    }
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
