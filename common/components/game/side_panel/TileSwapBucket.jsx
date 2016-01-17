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
    connectDropTarget:  PropTypes.func.isRequired,
    isOver:             PropTypes.bool.isRequired,

    bucket:             PropTypes.array.isRequired
  };

  generateTilePlaceholders() {
    return _.range(8).map( (key) => (
      <div className="tile-placeholder" key={key}></div>
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
