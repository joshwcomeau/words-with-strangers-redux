import React  from 'react';
import * as _ from 'lodash';

const Controls = React.createClass({
  clickHandler() {
    // Invoke the dispatcher, passed in through props.
    this.props.addTiles(2);
  },
  render() {
    return (
      <div id="controls">
        <button onClick={this.clickHandler}>Add Tiles</button>
      </div>
    )
  }
});

export default Controls;
