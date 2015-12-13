import React from 'react';

const TileRack = React.createClass({
  renderTiles() {
    return this.props.rack.map( tile => {
      return (
        <div className='tile' key={tile._id}>
          {tile.letter}
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
