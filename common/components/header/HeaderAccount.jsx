import React from 'react';

const HeaderAccount = React.createClass({
  menuName: 'headerAuthentication',
  isActive() {
    return this.props.activeMenu === this.menuName;
  },
  toggleMenu() {
    this.isActive() ? this.props.closeMenu() : this.props.openMenu(this.menuName);
  },

  profileLink() {
    return '/game'
    // return FlowRouter.path('profile', { profileId: this.props.currentUser._id });
  },
  logout() {
    // Meteor.logout( (err) => {
    //   if (err) console.error( "Error logging out:", err );
    //   this.setState({ menuOpen: false });
    // });
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
            <a href={this.profileLink()} className="profile-link">
              <strong>{this.props.user.username}</strong><br />
              <span>View My Profile</span>
            </a>
            <a className="log-out-link" onClick={this.logout}>Log Out</a>
          </div>
        </div>

      </span>
    );
  }
});

export default HeaderAccount;
