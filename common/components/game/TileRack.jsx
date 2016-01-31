import React, { Component, PropTypes} from 'react';
import { DropTarget }                 from 'react-dnd';
import * as _                         from 'lodash';
import classNames                     from 'classnames';
import FlipMove                       from 'react-flip-move';

import Tile                           from './Tile.jsx';


const rackTarget = {
  drop(props, monitor) {
    // It's possible that this is an event bubbling up from a switch-tile drop.
    // If the player dropped a tile onto another tile to switch their positions,
    // we want to ignore this event.
    if ( monitor.didDrop() ) return;

    const tile = monitor.getItem();

    const tileData = {
      id: tile.id,
      location: 'rack',
    };

    // Invoke the action.
    props.placeTile(tileData);
  }
}

@DropTarget('tile', rackTarget, (connect, monitor) => ({
  connectDropTarget:  connect.dropTarget(),
  isOver:             monitor.isOver()
}))
class TileRack extends Component {
  static propTypes = {
    connectDropTarget:  PropTypes.func.isRequired,
    isOver:             PropTypes.bool.isRequired,
  };

  renderTiles() {
    const {
      tiles,
      isMyTurn,
      pickTile,
      placeTile,
      switchTilePositions
    } = this.props;

    return tiles.map( tile => (
      <Tile key={tile.id}
        tile={tile}
        switchTilePositions={switchTilePositions}
        isMyTurn={isMyTurn}
        pickTile={pickTile}
        placeTile={placeTile}
      />
    ));
  }

  render() {
    const { connectDropTarget, isOver } = this.props;

    const classes = classNames({
      'moused-over': isOver
    });

    return connectDropTarget(
      <div id="tile-rack" className={classes}>
        <FlipMove duration="200">
          {this.renderTiles()}
        </FlipMove>
      </div>
    );
  }
};


export default TileRack;
