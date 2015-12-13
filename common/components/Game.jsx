import React from 'react';

import TileRack from './TileRack.jsx';

const Game = React.createClass({

  render() {
    console.log("Game given props", this.props);
    return (
      <div id="game">
        <TileRack tiles={this.props}
      </div>
    );
  }
});

export default Game;
