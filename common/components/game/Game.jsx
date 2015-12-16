import React                from 'react';
import { DragDropContext }  from 'react-dnd';
import Html5Backend         from 'react-dnd-html5-backend';

import TileRack   from './TileRack.jsx';
import SidePanel  from './side_panel/SidePanel.jsx';
import Board      from './board/Board.jsx';
import Controls   from './Controls.jsx';

const Game = React.createClass({
  render() {
    return (
      <div id="game">
        <SidePanel players={this.props.players} turns={this.props.turns} />
        <Board tiles={this.props.board} placeTile={this.props.placeTile} />
        <TileRack tiles={this.props.rack} />
        <Controls
          isMyTurn={this.props.status.isMyTurn}
          isValidTurn={this.props.status.isValidTurn}
          submitWord={this.props.submitWord}
        />
      </div>
    );
  }
});

export default DragDropContext(Html5Backend)(Game);
