import React, { Component, PropTypes }  from 'react';
import { DragSource, DropTarget }       from 'react-dnd';
import classNames                       from 'classnames';

import { isEstablished, isTentative }   from '../../lib/game_logic.lib';

const tileSource = {
  beginDrag(props) {
    props.pickTile();
    return props.tile;
  }
};

const tileTarget = {
  drop(props, monitor) {
    // We want to swap tile positions when dropped on top of one.
    const droppedTile = monitor.getItem();
    const underlyingTile = props.tile;

    // Don't swap them if the underlying tile is established!
    if ( typeof underlyingTile.turnId !== 'undefined' ) return;

    // If both tiles are in the same location, swap their positions.
    if ( droppedTile.location === underlyingTile.location ) {
      return props.switchTilePositions(droppedTile, underlyingTile);
    }

    // If we're going from board to rack, insert the tile into the rack
    // at the specified position.
    if ( underlyingTile.location === 'rack' ) {
      // The way this works is we're taking the droppedTile and assigning
      // it the underlyingTile's index position. Then, the reducer will
      // slide all subsequent tiles 1 spot to the right.
      let droppedData = _.pick(droppedTile, ['id', 'letter', 'points'])
      let tileData = _.extend( {}, underlyingTile, droppedData);

      return props.placeTile(tileData);
    }

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
class Tile extends Component {
  static propTypes = {
    // React DnD things
    connectDragSource:  PropTypes.func.isRequired,
    connectDropTarget:  PropTypes.func.isRequired,
    isDragging:         PropTypes.bool.isRequired,
    isOver:             PropTypes.bool.isRequired,

    isMyTurn:           PropTypes.bool.isRequired,
    tile:               PropTypes.shape({
      letter:               PropTypes.string.isRequired,
      points:               PropTypes.number.isRequired,
      location:             PropTypes.string.isRequired,
      belongsToCurrentUser: PropTypes.bool.isRequired
    }).isRequired
  };

  canBeDragged() {
    const isMyTurn = this.props.isMyTurn;
    const isMyTile = this.props.tile.belongsToCurrentUser;
    const isTentativeTile = isTentative(this.props.tile);

    return isMyTurn && isMyTile && isTentativeTile;
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

export default Tile
