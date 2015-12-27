import React          from 'react';
import { DropTarget } from 'react-dnd';
import * as _         from 'lodash';
import classNames     from 'classnames';

import Tile           from './Tile.jsx';

const TileRack = React.createClass({
  renderTiles() {
    if ( !this.props.tiles ) return
    return this.props.tiles.map( tile => <Tile tile={tile} key={tile._id} /> );
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
    const tile = monitor.getItem();

    const tileData = {
      location: 'rack',
      _id:      tile._id
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
