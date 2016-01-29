import React, { Component } from 'react';
import ReactDOM             from 'react-dom';


class MagicMove extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    React.Children.forEach(this.props.children, child => {
      const virtualNode = this.refs[child.key];
      const domNode     = ReactDOM.findDOMNode(virtualNode);
      const boundingBox = domNode.getBoundingClientRect();

      // Store this bounding box in the state, so that it can be accessed in
      // `componentDidUpdate`. By conparing the relative positions between the
      // two, we'll know how the box has to move =)
      let stateObj      = { [child.key]: boundingBox };
      this.setState(stateObj);
    });
  }

  componentDidUpdate(prevProps) {
    React.Children.forEach(this.props.children, child => {
      const virtualNode = this.refs[child.key];
      const domNode     = ReactDOM.findDOMNode(virtualNode);

      const newBox = domNode.getBoundingClientRect();
      const oldBox = this.state[child.key];
      const deltaY = oldBox.top  - newBox.top;
      const deltaX = oldBox.left - newBox.left;

      // TODO: animation!
      // https://aerotwist.com/blog/flip-your-animations/

    });
  }

  childrenWithRefs () {
    return React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { ref: child.key });
    });
  }

  render() {
    console.log('Magic move render', this.state)
    return (
      <div>
        {this.childrenWithRefs()}
      </div>
    );
  }
}

export default MagicMove;
