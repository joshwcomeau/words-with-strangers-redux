import React            from 'react';
import io               from 'socket.io-client';

import GamesListHeader  from './GamesListHeader.jsx';
import GamesListTable   from './GamesListTable.jsx';

const GamesList = React.createClass({
  componentWillMount() {
    // Indicate to the server that we need a
    this.props.actions.requestGamesList()
  },
  render() {

    return (
      <div id="games-list" className="center-section">
        <GamesListHeader
          authenticated={this.props.auth.authenticated}
          createGame={this.props.actions.createGame}
        />
        <div className="card">
          <GamesListTable
            authenticated={this.props.auth.authenticated}
            authUser={this.props.auth.user}
            games={this.props.gamesList}
            joinGame={this.props.actions.joinGame}
          />
        </div>
      </div>
    )
  }
});

export default GamesList
