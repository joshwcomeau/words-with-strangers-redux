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
        image: 'http://www.vetprofessionals.com/catprofessional/images/home-cat.jpg',
        text: 'Never stare at the cat'
      }, {
        image: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
        text: 'Rolled-up cats are inarguably cuter than unrolled ones.'
      }, {
        image: 'http://www.atlanticveterinaryhospital.ca/wp-content/uploads/2015/11/cat4.jpg',
        text: 'This cat is in predator mode. Cute, fluffy predator.'
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
