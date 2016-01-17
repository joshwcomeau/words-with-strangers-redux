import React                from 'react';
import { DragDropContext }  from 'react-dnd';
import Html5Backend         from 'react-dnd-html5-backend';

import TileRack   from './TileRack.jsx';
import SidePanel  from './side_panel/SidePanel.jsx';
import Board      from './board/Board.jsx';
import Controls   from './Controls.jsx';

const Game = React.createClass({
  componentWillMount() {
    this.props.actions.subscribeToGame(this.props.params.gameId);
  },
  componentWillUnmount() {
    this.props.actions.unsubscribeFromGame(this.props.params.gameId);
  },
  render() {
    return (
      <div id="game">
        <SidePanel
          players={this.props.players}
          turns={this.props.turns}
          title={this.props.title}
          swap={this.props.swap}
          toggleSwapping={this.props.actions.toggleSwapping}
          submitSwappedTiles={this.props.actions.submitSwappedTiles}
          placeTile={this.props.actions.placeTile}
        />
        <Board
          tiles={this.props.board}
          bonusSquares={this.props.bonusSquares}
          placeTile={this.props.actions.placeTile}
          switchTilePositions={this.props.actions.switchTilePositions}
          isMyTurn={this.props.isMyTurn}
        />
        <TileRack
          tiles={this.props.rack}
          placeTile={this.props.actions.placeTile}
          switchTilePositions={this.props.actions.switchTilePositions}
          isMyTurn={this.props.isMyTurn}
        />
        <Controls
          isMyTurn={this.props.isMyTurn}
          isValidPlacement={this.props.computed.isValidPlacement}
          submitWord={this.props.actions.submitWord}
          shuffleRack={this.props.actions.shuffleRack}
          recallTilesToRack={this.props.actions.recallTilesToRack}
        />
      </div>
    );
  }

});

export default DragDropContext(Html5Backend)(Game);
