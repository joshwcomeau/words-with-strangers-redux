import React            from 'react';
import io               from 'socket.io-client';

import GamesListHeader  from './GamesListHeader.jsx';
import GamesListTable   from './GamesListTable.jsx';

import {
  ADD_GAMES_TO_LIST
} from '../../constants/actions.constants';


const GamesList = React.createClass({
  componentDidMount() {
    const { actions } = this.props;

    // Join the 'games' namespace so we get all gamesList updates.
    const socket = io('http://localhost:3000/games');

    window.gameSocket = socket

    // Upon connection, the server should send a big list of all current
    // games. Use it to populate this list
    socket.on( ADD_GAMES_TO_LIST, games => {
      console.log("Socket sent stuff!", games)
      actions.addGamesToList(games)
    });

    // Listen for added games.
    socket.emit('CREATE_GAME', 'test')


  },
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
