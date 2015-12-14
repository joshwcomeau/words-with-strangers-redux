import React          from 'react';
import { DragSource } from 'react-dnd';


const Tile = React.createClass({
  propTypes: {
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired
  },
  canBeDragged() {
    // Tiles can only be dragged if:
    //  - it is this player's turn
    //  - the tile belongs to this player.
    //  - the tile isn't part of a previously-placed word.

    // TODO TODO TODO
    return true;
    // const myId = Meteor.userId();
    //
    // const isMyTurn = Modules.gameLogic.isMyTurn( this.props.tile.gameId );
    // const isMyTile = this.props.tile.playerId === myId;
    // const isActive = this.props.tile.turnId === undefined;
    //
    // return isMyTurn && isMyTile && isActive;

  },
  generateTile(draggable) {
    const { connectDragSource, isDragging } = this.props;

    let tileClassName = "tile";
    if ( draggable ) {
      tileClassName += " draggable";
    }

    const tile = (
      <div className={tileClassName} style={{ opacity: isDragging ? 0 : 1 }}>
        <div className="tile-letter">{this.props.tile.letter}</div>
        <div className="tile-points">{this.props.tile.points}</div>
      </div>
    );

    return draggable ? connectDragSource(tile) : tile;
  },
  render() {
    return this.generateTile( this.canBeDragged() );
  }
});


const tileSource = {
  beginDrag(props) {
    return props.tile;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

export default DragSource('tile', tileSource, collect)(Tile);
