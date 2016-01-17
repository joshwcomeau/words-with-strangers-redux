import React, { PropTypes } from 'react';
import classNames from 'classnames';

import TileSwapBucket from './TileSwapBucket';


const TileSwapContainer = ({swap, toggleSwapping, submitSwappedTiles}) => (
  <div className="tile-swap-container">
    { swap.active
      ? renderActiveSwapping(swap.bucket, submitSwappedTiles, toggleSwapping)
      : renderInactiveSwapping(toggleSwapping)
    }
  </div>
);

TileSwapContainer.propTypes = {
  toggleSwapping:     PropTypes.func.isRequired,
  submitSwappedTiles: PropTypes.func.isRequired,
  swap:               PropTypes.shape({
    active:           PropTypes.bool.isRequired,
    bucket:           PropTypes.array.isRequired
  }).isRequired
}

function renderActiveSwapping(bucket, submitSwappedTiles, toggleSwapping) {
  return (
    <div className="active-swapping">
      <TileSwapBucket bucket={bucket} />
      <div className="button-container">
        <button className="button submit-swapped-tiles">Swap</button>
        <button className="button cancel" onClick={toggleSwapping}>Cancel</button>
      </div>
    </div>
  )
}

function renderInactiveSwapping(toggleSwapping) {
  return (
    <div className="button-container">
      <button className='button enable-swap' onClick={toggleSwapping}>
        Swap Tiles
      </button>
    </div>
  );
}

export default TileSwapContainer
