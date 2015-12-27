import React, { Component, PropTypes }  from 'react';
import { DragSource, DropTarget }       from 'react-dnd';
import classNames                       from 'classnames';

const tileSource = {
  beginDrag(props) {
    return props.tile;
  }
};

const tileTarget = {
  drop(props, monitor) {
    console.log("Tile dropped on tile. original:", monitor.didDrop())

    // We want to swap tile positions when dropped on top of one.
    let droppedTile = monitor.getItem();
    let underlyingTile = props.tile;

    props.switchTilePositions(droppedTile, underlyingTile);
  }
}

@DropTarget('tile', tileTarget, (connect, monitor) => ({
  connectDropTarget:  connect.dropTarget(),
  isOver:             monitor.isOver()
}))
@DragSource('tile', tileSource, (connect, monitor) => ({
  connectDragSource:  connect.dragSource(),
  isDragging:         monitor.isDragging()
}))
export default class Tile extends Component {
  static propTypes = {
    connectDragSource:  PropTypes.func.isRequired,
    connectDropTarget:  PropTypes.func.isRequired,
    isDragging:         PropTypes.bool.isRequired
  }

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

  }

  generateTile(draggable) {
    const {
      connectDragSource,
      connectDropTarget,
      isDragging,
      isOver,
      tile
    } = this.props;

    const classes = classNames({
      'tile': true,
      'draggable': draggable,
      'is-dragging': isDragging
    });

    // style={{ opacity: isDragging ? 0 : 1 }}

    const tileNode = (
      <div className={classes}>
        <div className="tile-letter">{tile.letter}</div>
        <div className="tile-points">{tile.points}</div>
      </div>
    );

    return draggable ? connectDragSource(connectDropTarget(tileNode)) : tileNode;
  }

  render() {
    return this.generateTile( this.canBeDragged() );
  }
}
