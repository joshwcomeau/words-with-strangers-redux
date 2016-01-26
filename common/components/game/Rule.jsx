import React, { PropTypes } from 'react';
import _ from 'lodash';

const Rule = ({image, text}) => (
  <div className="rule">
    <div className="rule-image" style={{ backgroundImage: `url('${image}')` }} />
    <p>{text}</p>
  </div>
);

Rule.propTypes = {
  image:  PropTypes.string.isRequired,
  text:   PropTypes.string.isRequired
};


export default Rule;
