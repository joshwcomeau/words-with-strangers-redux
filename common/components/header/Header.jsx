import React from 'react';

import HeaderAccount        from './HeaderAccount.jsx';
import HeaderAuthentication from './HeaderAuthentication.jsx';


const Header = React.createClass({
  componentDidMount() {
    console.log(this.props);
  },
  render() {
    return (
      <header id="main-layout-header">
        <a href="/" id="main-layout-logo">Words with Strangers</a>
        <nav>
          { this.props.authenticated ?
            <HeaderAccount
              user={this.props.user}
              activeMenu={this.props.activeMenu}
              openMenu={this.props.openMenu}
              closeMenu={this.props.closeMenu}
            /> :
            <HeaderAuthentication
              login={this.props.login}
              error={this.props.error}
              activeMenu={this.props.activeMenu}
              openMenu={this.props.openMenu}
              closeMenu={this.props.closeMenu}
            />
          }
          <a className="nav-link">Leaderboard</a>
          <a className="nav-link" href='/games'>Games</a>


        </nav>
      </header>
    )
  }
});

export default Header;
