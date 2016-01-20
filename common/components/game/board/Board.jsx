import React  from 'react';
import * as _ from 'lodash';

import BoardSquare from './BoardSquare.jsx';

import {
  findTile,
  findBonusSquare
}  from '../../../lib/game_logic.lib';


const BOARD_SIZE = 13;

const Board = React.createClass({
  findTileAtCoords(x, y) {
    return _.find(this.props.tiles, tile => {
      return tile.x === x && tile.y === y;
    });
  },
  renderSquare(num) {
    // Figure out this square's coordinates.
    const x = num % BOARD_SIZE;
    const y = Math.floor(num / BOARD_SIZE);

    return (
      <BoardSquare
        key={x+'-'+y}
        x={x}
        y={y}
        pickTile={this.props.pickTile}
        placeTile={this.props.placeTile}
        switchTilePositions={this.props.switchTilePositions}
        isMyTurn={this.props.isMyTurn}
        tile={findTile({x,y}, this.props.tiles)}
        bonusSquare={findBonusSquare({x,y}, this.props.bonusSquares)}
      />
    );

  },
  render() {
    let squares = [];
    let num;

    for ( num = 0; num < (BOARD_SIZE * BOARD_SIZE); num++ ) {
      squares.push( this.renderSquare(num) );
    }

    return (
      <div id="board">
        {squares}
      </div>
    );
  }
});

export default Board;
