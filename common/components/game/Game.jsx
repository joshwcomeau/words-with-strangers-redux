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
        <Board tiles={this.props.board} />
        <TileRack tiles={this.props.rack} />
        <Controls tiles={this.props.rack} />
      </div>
    );
  }
});

export default DragDropContext(Html5Backend)(Game);
