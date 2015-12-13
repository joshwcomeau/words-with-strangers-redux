import React from 'react';

const TileRack = React.createClass({
  renderTiles() {
    return this.props.tiles.map( tile => {
      console.log("ITERATING WITH TILE", tile.toJS())
      return (
        <div className='tile' key={tile.get('_id')}>
          {tile.get('letter')}
        </div>
      )
    });
  },
  render() {
    console.log(this, this.props)
    return (
      <div id="tile-rack">
        {this.renderTiles()}
      </div>
    );
  }
});

export default TileRack;
