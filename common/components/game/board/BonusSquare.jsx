import React, { PropTypes } from 'react';
import _                    from 'lodash';


let BonusSquare = ({square}) => (
  <div className={`bonus-square ${square.label}`}>
    {square.label}
  </div>
);

BonusSquare.propTypes = {
  square: PropTypes.object.isRequired
};

export default BonusSquare;
