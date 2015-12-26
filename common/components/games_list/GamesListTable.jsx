import * as _ from 'lodash';
import React  from 'react';

import GamesListTableRow from './GamesListTableRow.jsx';

const GamesListTable = ({games, joinGame}) => (
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
      {generateList(games, joinGame)}
    </tbody>
  </table>
);

function generateList(games, joinGame) {
  if ( _.isEmpty(games) ) {
    return (
      <tr>
        <td>
          <h5>Sorry, no active games.</h5>
          <p>Why not start one?</p>
        </td>
      </tr>
    );
  }

  return games.map( (game) => (
    <GamesListTableRow key={game._id} game={game} joinGame={joinGame} />
  ));
}

export default GamesListTable;
