import React, { PropTypes } from 'react';
import { DropTarget }       from 'react-dnd';
import * as _               from 'lodash';

const BoardSquare = React.createClass({
  propTypes: {
    x:      PropTypes.number.isRequired,
    y:      PropTypes.number.isRequired,
    isOver: PropTypes.bool.isRequired
  },
  render() {
    const { connectDropTarget, isOver } = this.props;

    return connectDropTarget(
      <div className="board-square">
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
