import React, { PropTypes } from 'react';
import _ from 'lodash';

const Rule = ({image, text}) => (
  <div className="rule">
    <img src={image} className="rule-image" />
    <p dangerouslySetInnerHTML={{ __html: convertNewlinesToBrs(text) }} />
  </div>
);

Rule.propTypes = {
  image:  PropTypes.string.isRequired,
  text:   PropTypes.string.isRequired
};

function convertNewlinesToBrs(text) {
  // First, parse out any HTML. For safety.
  const divHolder = document.createElement('div');
  divHolder.innerHTML = text;
  let strippedText = divHolder.innerText;

  return strippedText.replace('\n', '<br />');
}


export default Rule;
