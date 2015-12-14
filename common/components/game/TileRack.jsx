import React  from 'react';
import * as _ from 'lodash';

import Tile   from './Tile.jsx';

const TileRack = React.createClass({
  renderTiles() {
    return this.props.tiles.map( tile => <Tile tile={tile} key={tile._id} /> );
  },
  render() {
    return (
      <div id="tile-rack">
        {this.renderTiles()}
      </div>
    );
  }
});

export default TileRack;
