import React, { PropTypes } from 'react';
import _ from 'lodash';

const Rule = ({image, text}) => (
  <div className="rule">
    <img src={image} className="rule-image" />
    <p dangerouslySetInnerHTML={{__html: text}}></p>
  </div>
);

Rule.propTypes = {
  image:  PropTypes.string.isRequired,
  text:   PropTypes.string.isRequired
};


export default Rule;
