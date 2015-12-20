import React    from 'react';

import Header   from '../../components/header/Header.jsx';

// TODO: Remove DevTools from production environment.
import DevTools from '../../containers/DevTools.jsx';


export default class AppView extends React.Component {
  render() {
    return (
      <div id="app-view">
        <Header
          auth={this.props.auth.authenticated}
          user={this.props.auth.user}
          authError={this.props.auth.details}
          activeMenu={this.props.ui.menu}
          openMenu={this.props.openMenu}
          closeMenu={this.props.closeMenu}
          login={this.props.login}
        />
        {this.props.children}
        <DevTools />
      </div>
    );
  }
}
