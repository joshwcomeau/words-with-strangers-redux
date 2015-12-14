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
  clickHandler() {
    // TEMP: For now, we're going to pretend that clicking a tile is the
    // same as dropping the first rack tile onto it. Just to practice.
    let tileId = __store.getState().toJS().game.rack[0]._id;
    console.log("Got tile", tileId);

    const tileData = {
      _id: tileId,
      x: this.props.x,
      y: this.props.y,
      location: 'board'
    };

    // Invoke the action.
    this.props.placeTile(tileData);

  },
  render() {
    const { connectDropTarget, isOver } = this.props;

    return connectDropTarget(
      <div className="board-square" onClick={this.clickHandler}>
        { this.props.children ? <Tile tile={this.props.children} /> : null }
        { isOver ? <div className='square-overlay'></div> : null }
      </div>
    );
  }
});

const squareTarget = {
  drop(props, monitor) {
    const tile = monitor.getItem();
    // TODO: Drop handling here
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

export default DropTarget('tile', squareTarget, collect)(BoardSquare);
