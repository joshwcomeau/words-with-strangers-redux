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
          error={this.props.auth.error}
          activeMenu={this.props.ui.menu}
          openMenu={this.props.openMenu}
          closeMenu={this.props.closeMenu}
          login={this.props.login}
        />
        <div id="main-layout-header-spacer"></div>
        {this.props.children}
        <DevTools />
      </div>
    );
  }
}
