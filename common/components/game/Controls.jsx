import React  from 'react';
import * as _ from 'lodash';

const Controls = React.createClass({
  isMyTurn: this.props.status ? this.props.status.isMyTurn : null,
  isValidTurn: this.props.status ? this.props.status.isValidTurn : null,


  render() {
    return (
      <div id="controls" className={this.isMyTurn ? 'my-turn' : 'their-turn'}>
        <div className="turn-indicator">{this.isMyTurn ? 'Your Turn' : 'Their Turn'}</div>
        <div className="submit-word-container">
          <button
          className="button submit-word"
          disabled={!this.isMyTurn}
          onClick={this.submitWord}
          >
            Submit Word
          </button>
        </div>
        <div className="other-actions-container">
          <button disabled={!this.isMyTurn}>
            <i className="fa fa-random"></i>
          </button>
          <button disabled={!this.isMyTurn}>
            <i className="fa fa-undo"></i>
          </button>
        </div>
      </div>
    );
  }
});

export default Controls;
