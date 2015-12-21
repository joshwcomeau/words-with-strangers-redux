import React from 'react';

const GamesListHeader = ({authenticated}) => (
  <header>
    { generateNewButton(authenticated) }
    <h4>Current Games</h4>
  </header>
);

function createGame() {
  console.log("New game created!")
}

function generateNewButton(isLoggedIn) {
  if ( isLoggedIn ) {
    return <button className="button" onClick={createGame}>Create New</button>
  } else {
    return <button className="button" disabled="true">Log in to Create Games</button>
  }

}

export default GamesListHeader;
