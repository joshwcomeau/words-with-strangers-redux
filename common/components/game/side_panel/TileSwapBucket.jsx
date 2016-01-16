import React, { Component, PropTypes }  from 'react';
import { DropTarget }                   from 'react-dnd';


const tileTarget = {
  drop(props, monitor) {
    const droppedTile = monitor.getItem();
    console.log("Tile dropped!", droppedTile);
    console.log("Props on drop", props);
  }
}

@DropTarget('tile', tileTarget, (connect, monitor) => ({
  connectDropTarget:  connect.dropTarget(),
  isOver:             monitor.isOver()
}))
class TileSwapBucket extends Component {
  static propTypes = {
    // React DnD things
    connectDragSource:  PropTypes.func.isRequired,
    connectDropTarget:  PropTypes.func.isRequired,
    isDragging:         PropTypes.bool.isRequired,
    isOver:             PropTypes.bool.isRequired,

    bucket:             PropTypes.array.isRequired
  };

  generateTilePlaceholders() {
    return _.range(6).map( () => (
      <div className="tile-placeholder"></div>
    ));
  }

  render() {
    return (
      <div className="tile-swap-bucket">
        { this.generateTilePlaceholders() }
      </div>
    )
  }
}

export default TileSwapBucket;
