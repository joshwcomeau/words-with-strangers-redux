import React, { Component, PropTypes }  from 'react';
import { DragSource, DropTarget }       from 'react-dnd';
import classNames                       from 'classnames';

import { isEstablished } from '../../lib/game_logic.lib';

const tileSource = {
  beginDrag(props) {
    return props.tile;
  }
};

const tileTarget = {
  drop(props, monitor) {
    // We want to swap tile positions when dropped on top of one.
    let droppedTile = monitor.getItem();
    let underlyingTile = props.tile;

    // Don't swap them if the underlying tile is established!
    if ( typeof underlyingTile.turnId !== 'undefined' ) return;

    // Don't swap them if they're from different locations (board or rack);
    if ( droppedTile.location !== underlyingTile.location ) return;

    return props.switchTilePositions(droppedTile, underlyingTile);
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
  };

  canBeDragged() {
    const isMyTurn = this.props.isMyTurn;
    const isMyTile = this.props.tile.belongsToCurrentUser;
    const isActive = typeof this.props.tile.turnId === 'undefined';

    return isMyTurn && isMyTile && isActive;
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
      'tile':           true,
      'draggable':      draggable,
      'is-dragging':    isDragging,
      'is-established': isEstablished(tile)
    });

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
