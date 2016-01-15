import React from 'react';

import TileSwapBucket from './TileSwapBucket';

const TileSwapContainer = ({tiles, submitSwappedTiles, swapping}) => (
  <div className="tile-swap-container">
    { swapping
      ? renderActiveSwapping(tiles, submitSwappedTiles)
      : null
    }
    <button className="button swap-toggle">
      { swapping ? "Swap Tiles" : "Cancel Swap" }
    </button>
  </div>
);

function renderActiveSwapping(tiles, submitSwappedTiles) {
  return (
    <div className="active-swapping">
      <TileSwapBucket tiles={tiles} />
      <button className="button submit-swapped-tiles">Swap</button>
    </div>
  )
}

function renderInactiveSwapping() {
  return (
    <button className="button swap-toggle">
  )
}
