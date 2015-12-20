import React from 'react';

// TODO: Remove DevTools from production environment.
import DevTools       from '../../containers/DevTools.jsx';


export default class AppView extends React.Component {
  render() {
    return (
      <div id="app-view">
        <h1>Words with Strangers</h1>
        <hr />
        {this.props.children}
        <DevTools />
      </div>
    );
  }
}
