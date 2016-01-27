import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import Rule from './Rule.jsx';


class RulesCard extends Component {
  static propTypes = {
    authUser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state ={
      rule: 0
    };
  }

  generateRules() {
    const rules = [
      {
        image: 'https://s3.amazonaws.com/wordswithstrangers/rule_1.png',
        text: "Place tiles and spell words.<br>It's scrabble, but with more randomization."
      }, {
        image: 'https://s3.amazonaws.com/wordswithstrangers/rule_2.png',
        text: 'Unlucky tiles? Swap them out for better ones.'
      }, {
        image: 'https://s3.amazonaws.com/wordswithstrangers/rule_3.png',
        text: 'First to 250 points wins!'
      }
    ]

    return rules.map( rule => <Rule {...rule} /> );
  }

  render() {
    return (
      <div id="rules-card" className="modal">
        <div className="modal-outer"><div className="modal-inner">
          <h2>Rules Card.</h2>
          <div className="rules-container">
            { this.generateRules() }
          </div>

          <div className="rules-selectors">
            <div className="selector-dot" />
            <div className="selector-dot" />
            <div className="selector-dot" />
          </div>

        </div></div>
      </div>
    );
  }
}

export default RulesCard;
