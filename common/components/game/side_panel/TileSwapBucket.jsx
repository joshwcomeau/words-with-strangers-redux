import React, { Component, PropTypes }  from 'react';
import { DropTarget }                   from 'react-dnd';
import classNames                       from 'classnames';

import Tile                             from '../Tile.jsx';
import soundEffects                     from '../../../lib/sound_effects.lib';


const tileTarget = {
  drop(props, monitor) {
    soundEffects.play('place_tile');

    const tile = monitor.getItem();
    const tileData = {
      id: tile.id,
      location: 'swap'
    };

    props.placeTile(tileData);
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

    tiles:               PropTypes.array.isRequired
  };

  generateTiles() {
    return _.range(8).map( (index) => {
      const tile = this.props.tiles[index];
      const classes = classNames({
        'tile-square': true,
        'contains-tile': !!tile
      });

      return (
        <div className={classes} key={index}>
          { tile ? <Tile tile={tile} isMyTurn={true} /> : null }
          <div className="tile-placeholder" />
        </div>
      )
    });
  }

  render() {
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <div className="tile-swap-bucket">
        { this.generateTiles() }
      </div>
    )
  }
}

export default TileSwapBucket;
