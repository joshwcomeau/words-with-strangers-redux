import React, { PropTypes } from 'react';
import { DropTarget }       from 'react-dnd';
import * as _               from 'lodash';
import classNames           from 'classnames';

import Tile                 from '../Tile.jsx';
import BonusSquare          from './BonusSquare.jsx';

const BoardSquare = React.createClass({
  propTypes: {
    x:      PropTypes.number.isRequired,
    y:      PropTypes.number.isRequired,
    isOver: PropTypes.bool.isRequired
  },

  renderPoints() {
    if ( !this.props.tile || !this.props.tile.turnPoints ) return null;

    return (
      <div className="turn-points">
        { this.props.tile.turnPoints }
      </div>
    )
  },

  renderTile() {
    return (
      <Tile
        tile={this.props.tile}
        switchTilePositions={this.props.switchTilePositions}
        isMyTurn={this.props.isMyTurn}
        pickTile={this.props.pickTile}
        placeTile={this.props.placeTile}
      />
    );
  },

  renderBonusSquare() {
    return <BonusSquare square={this.props.bonusSquare} />;
  },

  renderSquare() {
    const classes = classNames({
      "board-square": true,
      "dragged-over": this.props.isOver
    });

    return (
      <div className={classes}>
        { this.renderPoints() }
        { this.props.tile ? this.renderTile() : null }
        { this.props.bonusSquare ? this.renderBonusSquare() : null }
        { this.props.isOver ? <div className='square-overlay'></div> : null }
      </div>
    );
  },

  render() {
    if ( this.props.tile ) {
      // If this square already has a tile in it, we don't want to allow drops.
      return this.renderSquare();
    } else {
      return this.props.connectDropTarget( this.renderSquare() );
    }
  }
});

const squareTarget = {
  drop(props, monitor) {

    // TODO: This shares a LOT of behaviour with TileRack.jsx's rackTarget.
    // Move it into some kind of lib file for DnD stuff?
    const tile = monitor.getItem();

    const tileData = {
      location: 'board',
      id:       tile.id,
      x:        props.x,
      y:        props.y
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
