import React            from 'react';
import GamesListHeader  from './GamesListHeader.jsx';
import GamesListTable   from './GamesListTable.jsx';

const GamesList = ({ gamesList, auth, createGame }) => (
  <div id="games-list" className="center-section">
    <GamesListHeader authenticated={auth.authenticated} />
    <div className="card">
      <GamesListTable games={gamesList} />
    </div>
  </div>
);

export default GamesList
