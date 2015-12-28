import React                    from 'react';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';

import Header       from '../../components/layout/header/Header.jsx';
import FlashMessage from '../../components/layout/FlashMessage.jsx';

// TODO: Remove DevTools from production environment.
import DevTools from '../../containers/DevTools.jsx';


export default class AppView extends React.Component {
  render() {
    console.log("Rendering with flash", this.props.ui.flash);
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
          logout={this.props.logout}
        />
        <div id="main-layout-header-spacer"></div>

        <ReactCSSTransitionGroup
          transitionName="flash-message-transition"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          { this.props.ui.flash ? <FlashMessage message={this.props.ui.flash.message} type={this.props.ui.flash.type} /> : null }
        </ReactCSSTransitionGroup>

        {this.props.children}
        <DevTools />
      </div>
    );
  }
}
