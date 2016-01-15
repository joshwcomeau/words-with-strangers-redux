import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import TestBackend from 'react-dnd-test-backend';

export default function wrapInTestContext(DecoratedComponent) {
  @DragDropContext(TestBackend)
  class TestContextContainer extends Component {
    render() {
      return <DecoratedComponent {...this.props} />;
    }
  }

  return TestContextContainer;
}
