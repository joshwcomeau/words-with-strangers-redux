import React, { PropTypes } from 'react';
import classNames from 'classnames';

import TileSwapBucket from './TileSwapBucket';


const TileSwap = (props) => {
  return (
    <div className="tile-swap-container">
      {
        props.swap.active
        ? renderActiveSwapping(props)
        : renderInactiveSwapping(props.toggleSwapping)
      }
    </div>
  );
};

TileSwap.propTypes = {
  toggleSwapping:     PropTypes.func.isRequired,
  submitSwappedTiles: PropTypes.func.isRequired,
  swap:               PropTypes.shape({
    active:           PropTypes.bool.isRequired,
    bucket:           PropTypes.array.isRequired
  }).isRequired
}

function renderActiveSwapping({swap, submitSwappedTiles, toggleSwapping, placeTile}) {
  return (
    <div className="active-swapping">
      <TileSwapBucket bucket={swap.bucket} placeTile={placeTile} />
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

export default TileSwap
