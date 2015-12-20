import React from 'react';

import HeaderAccountMenu    from './HeaderAccountMenu.jsx';
import HeaderAuthentication from './HeaderAuthentication.jsx';


const Header = React.createClass({

  render() {
    return (
      <header id="main-layout-header">
        <a href="/" id="main-layout-logo">Words with Strangers</a>
        <nav>
          { this.props.authenticated ?
            <HeaderAccountMenu user={this.props.user} /> :
            <HeaderAuthentication />
          }
          <a className="nav-link">Leaderboard</a>
          <a className="nav-link" href='/games'>Games</a>


        </nav>
      </header>
    )
  }
});

export default Header;
