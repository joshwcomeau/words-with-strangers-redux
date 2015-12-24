import React            from 'react';
import io               from 'socket.io-client';

import GamesListHeader  from './GamesListHeader.jsx';
import GamesListTable   from './GamesListTable.jsx';

import {
  ADD_GAMES_TO_LIST
} from '../../constants/actions.constants';


const GamesList = React.createClass({

  render() {
    return (
      <div id="games-list" className="center-section">
        <GamesListHeader
          authenticated={this.props.auth.authenticated}
          createGame={this.props.actions.createGame}
        />
        <div className="card">
          <GamesListTable games={this.props.gamesList} />
        </div>
      </div>
    )
  }
});

export default GamesList
