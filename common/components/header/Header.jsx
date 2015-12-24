import React from 'react';
import { Link } from 'react-router';

import HeaderAccount        from './HeaderAccount.jsx';
import HeaderAuthentication from './HeaderAuthentication.jsx';


const Header = React.createClass({
  render() {
    return (
      <header id="main-layout-header">
        <Link to="/" id="main-layout-logo">Words with Strangers</Link>
        <nav>
          { this.props.authenticated ?
            <HeaderAccount
              logout={this.props.logout}
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
          <Link to='/leaderboards' className="nav-link">Leaderboard</Link>
          <Link to='/games' className="nav-link" >Games</Link>


        </nav>
      </header>
    )
  }
});

export default Header;
