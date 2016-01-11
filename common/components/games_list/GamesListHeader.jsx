import React from 'react';

const GamesListHeader = (props) => (
  <header>
    { generateNewButton(props) }
    <h4>Current Games</h4>
  </header>
);

function generateNewButton({authenticated, createGame}) {
  if ( authenticated ) {
    return <button className="button" onClick={createGame}>Create New</button>
  }
}

export default GamesListHeader;
