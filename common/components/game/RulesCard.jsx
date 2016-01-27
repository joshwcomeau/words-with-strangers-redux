import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import Rule from './Rule.jsx';
import rules from '../../data/rules';


// This component is a bit different, because it owns its state.
// It didn't make sense to me to keep which rule the user is currently viewing
// in the reducer, because it's so unimportant to the functioning of the app.
// Closing the rules is a legitimate action, but browsing between them is
// uninteresting to the app at large.
class RulesCard extends Component {
  constructor(props) {
    super(props);

    this.state ={
      selected: 0
    };
  }

  select(num) {
    this.setState({ selected: num })
  }

  increment() {
    const selected = (this.state.selected + 1) % rules.length;
    this.setState({ selected });
  }
  decrement() {
    const selected = (this.state.selected - 1) % rules.length;
    this.setState({ selected });
  }

  generateRules() {
    return rules.map( (rule, n) => <Rule key={n} {...rule} /> );
  }

  generateDots() {
    return _.times(rules.length, n => {
      const classes = classNames({
        dot: true,
        selected: this.state.selected === n
      });

      return (
        <div
          key={n}
          className={classes}
          onClick={this.select.bind(this, n)}
        />
      );
    });
  }

  render() {
    const offsetPercentage = this.state.selected * -33.3 + "%";
    const containerStyle = {
      transform: `translate(${offsetPercentage},0)`
    }
    return (
      <div id="rules-card" className="modal">
        <div className="modal-outer"><div className="modal-inner">
          <h2>Rules Card.</h2>

          <div className="rules-container" style={containerStyle}>
            { this.generateRules() }
          </div>

          <div className="dots-container">
            <div className="arrow left" onClick={this.decrement.bind(this)} />
            { this.generateDots() }
            <div className="arrow right" onClick={this.increment.bind(this)} />
          </div>

          <button className="button" onClick={this.props.toggleRules}>
            Start Game
          </button>

        </div></div>
      </div>
    );
  }
}

export default RulesCard;
