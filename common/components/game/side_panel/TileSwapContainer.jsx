import React, { PropTypes } from 'react';
import classNames from 'classnames';

import TileSwapBucket from './TileSwapBucket';


const TileSwapContainer = ({swap, toggleSwapping, submitSwappedTiles}) => (
  <div className="tile-swap-container">
    { swap.active
      ? renderActiveSwapping(swap.bucket, submitSwappedTiles)
      : null
    }
    { renderButton(swap.active, toggleSwapping) }
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

function renderButton(active, toggleSwapping) {
  const classes = classNames({
    button: true,
    cancel: active
  });

  return (
    <button className={classes} onClick={toggleSwapping}>
      { active ? "Cancel Swap" : "Swap Tiles" }
    </button>
  )
}

function renderActiveSwapping(bucket, submitSwappedTiles) {
  return (
    <div className="active-swapping">
      <TileSwapBucket bucket={bucket} />
      <button className="button submit-swapped-tiles">Swap</button>
    </div>
  )
}

export default TileSwapContainer
