import React    from 'react';
import { Link } from 'react-router';

const HeaderAccount = React.createClass({
  menuName: 'headerAuthentication',
  isActive() {
    return this.props.activeMenu === this.menuName;
  },
  toggleMenu() {
    this.isActive() ? this.props.closeMenu() : this.props.openMenu(this.menuName);
  },

  render() {
    return (
      <span className="nav-link header-account">
        <button className="account-thumb" onClick={this.toggleMenu} style={{
          backgroundImage: `url('${this.props.user.profilePhoto}')`
        }}></button>
      <div className={this.isActive() ? '' : 'hide'}>
        <div className="dropdown-menu-blocker account-menu-blocker" onClick={this.toggleMenu}></div>
          <div className="dropdown-menu account-menu right-arrow">
            <a className="profile-link">
              <strong>{this.props.user.username}</strong><br />
            </a>
            <a className="log-out-link" onClick={this.props.logout}>
              Log Out
            </a>
          </div>
        </div>

      </span>
    );
  }
});

export default HeaderAccount;
