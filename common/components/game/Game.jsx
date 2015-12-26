import React                from 'react';
import { DragDropContext }  from 'react-dnd';
import Html5Backend         from 'react-dnd-html5-backend';

import TileRack   from './TileRack.jsx';
import SidePanel  from './side_panel/SidePanel.jsx';
import Board      from './board/Board.jsx';
import Controls   from './Controls.jsx';

const Game = React.createClass({
  componentWillMount() {
    // The way this works:
    // When this component loads (or receives props? TBD), it dispatches an
    // action which fires an event over the socket to the server that says
    // "I'm here, joining this game!". The socket joins the "room" that
    // corresponds to the game Id, and sends the initial game data to the
    // client.
    // When a word is submitted, it dispatches an action. This action
    // fires an event to the server notifying it of the submission.
    // the server then emits a UPDATE_GAME_STATE event to notify everyone in
    // the room that the game data has been updated.
    // In index.jsx, we listen for this UPDATE_GAME_STATE event, and when it
    // happens, we dispatch an action locally, with the new game data, to
    // update the state.
    this.props.actions.subscribeToGame(this.props.params.gameId);

  },
  render() {
    console.log("Rendering game with props", this.props)
    return (
      <div id="game">
        <SidePanel players={this.props.players} turns={this.props.turns} />
        <Board tiles={this.props.board} placeTile={this.props.actions.placeTile} />
        <TileRack tiles={this.props.rack} />
        <Controls
          isMyTurn={this.props.computed.isMyTurn}
          isValidPlacement={this.props.computed.isValidPlacement}
          submitWord={this.props.actions.submitWord}
        />
      </div>
    );
  }

});

export default DragDropContext(Html5Backend)(Game);
