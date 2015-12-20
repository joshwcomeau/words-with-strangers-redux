import React    from 'react';

import Header   from '../../components/header/Header.jsx';

// TODO: Remove DevTools from production environment.
import DevTools from '../../containers/DevTools.jsx';


export default class AppView extends React.Component {
  render() {
    return (
      <div id="app-view">
        <Header
          authenticated={this.props.auth.authenticated}
          user={this.props.auth.user}
        />
        {this.props.children}
        <DevTools />
      </div>
    );
  }
}
