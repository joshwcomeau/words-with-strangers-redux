import React from 'react';

const TileRack = React.createClass({
  renderTiles() {
    return this.props.tiles.map( tile => {
      return (
        <div className='tile' key={tile.get('_id')}>
          {tile.get('letter')}
        </div>
      )
    });
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
