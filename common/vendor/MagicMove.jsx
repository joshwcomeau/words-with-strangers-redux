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
      // Get the top/left/right/bottom positions of this element,
      // and store it in the state.
      const boundingBox = domNode.getBoundingClientRect();
      this.setState({ [child.key]: boundingBox });
    });
  }

  componentDidUpdate(prevProps) {
    // If we haven't assigned any keys to state yet, it's the first render.
    // The first render cannot possibly have any animations. No work needed.
    if ( !this.state ) return;

    React.Children.forEach(this.props.children, child => {
      const virtualNode = this.refs[child.key];
      const domNode     = ReactDOM.findDOMNode(virtualNode);

      const newBox = domNode.getBoundingClientRect();
      const oldBox = this.state[child.key];
      const deltaX = oldBox.left - newBox.left;
      const deltaY = oldBox.top  - newBox.top;

      // If the deltas have not changed, no animation is necessary.
      if ( !deltaX && !deltaY ) return;

      // Ok, so the component is now in a new spot.
      // Animate it from where it was to where it is.
      domNode.animate([
        { transform: `translate(${deltaX}px, ${deltaY}px)`},
        { transform: 'translate(0,0)'}
      ], {
        duration: 150
      });

    });
  }

  childrenWithRefs () {
    return React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { ref: child.key });
    });
  }

  render() {
    return (
      <div>
        {this.childrenWithRefs()}
      </div>
    );
  }
}

export default MagicMove;
