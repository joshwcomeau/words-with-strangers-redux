import React                    from 'react';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import classNames               from 'classnames';

import Header       from '../../components/layout/header/Header.jsx';
import FlashMessage from '../../components/layout/FlashMessage.jsx';

export default function createLayout(DevTools = null) {
  return class Layout extends React.Component {
    renderHeader() {
      return (
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
      );
    }

    renderHeaderSpacer() {
      return <div id="main-layout-header-spacer"></div>;
    }

    renderFlashMessage() {
      return (
        <ReactCSSTransitionGroup
          transitionName="flash-message-transition"
          transitionEnterTimeout={650}
          transitionLeaveTimeout={450}
        >
          { this.props.ui.flash ? <FlashMessage message={this.props.ui.flash.message} type={this.props.ui.flash.type} /> : null }
        </ReactCSSTransitionGroup>
      );
    }

    render() {
      let classes = classNames({
        'wrapped-for-devtools': process.env.NODE_ENV !== 'production'
      });

      return (
        <div id="layout" className={classes}>
          { this.renderHeader() }
          { this.renderHeaderSpacer() }
          { this.renderFlashMessage() }
          { this.props.children }

          { DevTools ? <DevTools /> : null }
        </div>
      );
    }
  }
}
