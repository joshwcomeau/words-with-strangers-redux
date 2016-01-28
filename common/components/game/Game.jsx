import React                from 'react';
import { DragDropContext }  from 'react-dnd';
import Html5Backend         from 'react-dnd-html5-backend';

import TileRack   from './TileRack.jsx';
import SidePanel  from './side_panel/SidePanel.jsx';
import Board      from './board/Board.jsx';
import Controls   from './Controls.jsx';
import Results    from './Results.jsx';
import RulesCard  from './RulesCard.jsx';

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
          gameId={this.props.id}
          players={this.props.players}
          turns={this.props.turns}
          title={this.props.title}
          status={this.props.status}
          swap={this.props.swap}
          isSwapActive={this.props.isSwapActive}
          isMyTurn={this.props.isMyTurn}
          toggleSwapping={this.props.actions.toggleSwapping}
          submitSwappedTiles={this.props.actions.submitSwappedTiles}
          passTurn={this.props.actions.passTurn}
          pickTile={this.props.actions.pickTile}
          placeTile={this.props.actions.placeTile}
        />
        <Board
          tiles={this.props.board}
          bonusSquares={this.props.bonusSquares}
          pickTile={this.props.actions.pickTile}
          placeTile={this.props.actions.placeTile}
          switchTilePositions={this.props.actions.switchTilePositions}
          isMyTurn={this.props.isMyTurn}
        />
        { generateRack(this.props) }
        { generateControls(this.props) }
        { generateNotice(this.props)}
        {
          this.props.status === 'completed'
          ? <Results isWinner={this.props.isWinner} />
          : null
        }
        {
          this.props.isViewingRules
          ? <RulesCard toggleRules={this.props.actions.toggleRules} />
          : null
        }
      </div>
    );
  }
});

function generateRack(props) {
  if ( props.status === 'in_progress' && !props.computed.isSpectator ) {
    return (
      <TileRack
        tiles={props.rack}
        pickTile={props.actions.pickTile}
        placeTile={props.actions.placeTile}
        switchTilePositions={props.actions.switchTilePositions}
        isMyTurn={props.isMyTurn}
      />
    );
  }
}

function generateControls(props) {
  if ( props.status === 'in_progress' && !props.computed.isSpectator ) {
    return (
      <Controls
        isMyTurn={props.isMyTurn}
        isValidPlacement={props.computed.isValidPlacement}
        submitWord={props.actions.submitWord}
        shuffleRack={props.actions.shuffleRack}
        recallTilesToRack={props.actions.recallTilesToRack}
      />
    );
  }
}

function generateNotice(props) {
  if ( props.status === 'waiting' ) {
    return (
      <div id="notice">
        <h2>Waiting for Players...</h2>
      </div>
    );
  } else if ( props.computed.isSpectator ) {
    return (
      <div id="notice">
        <h2>You are a spectator.</h2>
      </div>
    );
  }
}

export default DragDropContext(Html5Backend)(Game);
