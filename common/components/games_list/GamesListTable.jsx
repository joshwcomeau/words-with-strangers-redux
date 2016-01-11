import * as _ from 'lodash';
import React  from 'react';

import GamesListTableRow from './GamesListTableRow.jsx';

const GamesListTable = ({games, joinGame, authenticated}) => (
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Players</th>
        <th>Created</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {generateList(games, joinGame, authenticated)}
    </tbody>
  </table>
);

function generateList(games, joinGame, authenticated) {
  if ( _.isEmpty(games) ) {
    return (
      <tr>
        <td colspan="5">
          <h5>Sorry, no active games.</h5>
          <p>Why not start one?</p>
        </td>
      </tr>
    );
  }

  return games.map( (game) => (
    <GamesListTableRow
      key={game.id}
      game={game}
      joinGame={joinGame}
      authenticated={authenticated}
    />
  ));
}

export default GamesListTable;
