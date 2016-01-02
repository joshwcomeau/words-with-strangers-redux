import React          from 'react';
import { DropTarget } from 'react-dnd';
import * as _         from 'lodash';
import classNames     from 'classnames';

import Tile           from './Tile.jsx';

const TileRack = React.createClass({
  renderTiles() {
    let tiles = _.sortBy(this.props.tiles, 'x');
    return tiles.map( tile => (
      <Tile key={tile.id}
      tile={tile}
      switchTilePositions={this.props.switchTilePositions}
      isMyTurn={this.props.isMyTurn}
      />)
    );
  },
  render() {
    const { connectDropTarget, isOver } = this.props;

    const classes = classNames({
      'moused-over': isOver
    });

    return connectDropTarget(
      <div id="tile-rack" className={classes}>
        {this.renderTiles()}
      </div>
    );
  }
});

const rackTarget = {
  drop(props, monitor) {
    // It's possible that this is an event bubbling up from a switch-tile drop.
    // If the player dropped a tile onto another tile to switch their positions,
    // we want to ignore this event.
    if ( monitor.didDrop() ) return;

    const tile = monitor.getItem();

    const tileData = {
      location: 'rack',
      id:      tile.id
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

export default DropTarget('tile', rackTarget, collect)(TileRack);;
