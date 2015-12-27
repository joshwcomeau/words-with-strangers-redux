import React, { PropTypes } from 'react';
import { DropTarget }       from 'react-dnd';
import * as _               from 'lodash';

import Tile                 from '../Tile.jsx';

const BoardSquare = React.createClass({
  propTypes: {
    x:      PropTypes.number.isRequired,
    y:      PropTypes.number.isRequired,
    isOver: PropTypes.bool.isRequired
  },
  render() {
    const { connectDropTarget, isOver, switchTilePositions } = this.props;

    return connectDropTarget(
      <div className="board-square">
        { this.props.children ? <Tile tile={this.props.children} switchTilePositions={switchTilePositions} /> : null }
        { isOver ? <div className='square-overlay'></div> : null }
      </div>
    );
  }
});

const squareTarget = {
  drop(props, monitor) {
    console.log("BoardSquare Dropped with props", props)
    // TODO: This shares a LOT of behaviour with TileRack.jsx's rackTarget.
    // Move it into some kind of lib file for DnD stuff?


    // It's possible that this is an event bubbling up from a switch-tile drop.
    // If the player dropped a tile onto another tile to switch their positions,
    // we want to ignore this event.
    if ( monitor.didDrop() ) return;

    const tile = monitor.getItem();

    const tileData = {
      location: 'board',
      _id: tile._id,
      x: props.x,
      y: props.y
    };

    // Invoke the action.
    props.placeTile(tileData);

  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

export default DropTarget('tile', squareTarget, collect)(BoardSquare);
