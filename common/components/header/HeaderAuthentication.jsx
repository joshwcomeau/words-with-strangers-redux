import React from 'react';

const HeaderAuthentication = React.createClass({
  menuName: 'headerAuthentication',
  isActive() {
    return this.props.activeMenu === this.menuName;
  },
  toggleMenu() {
    this.isActive() ? this.props.closeMenu() : this.props.openMenu(this.menuName);
  },
  submitLogin(ev) {
    ev.preventDefault();

    let username = ReactDOM.findDOMNode(this.refs.username).value;
    let password = ReactDOM.findDOMNode(this.refs.password).value;

    // TODO: some form of basic validation.

    // Meteor.loginWithPassword(username, password, (err) => {
    //   if ( err ) {
    //     // TODO: Error handling
    //     console.error( "Error logging in:", err );
    //   } else if ( !Meteor.user() ){
    //     console.error( "No formal error logging in, but we aren't logged in =(");
    //   } else {
    //     // Success! Just close the window.
    //     this.setState({ menuOpen: false });
    //   }
    // });

  },
  render() {
    return (
      <span className="nav-link header-log-in">
        <div className="log-in-text" onClick={this.toggleMenu}>
          Sign In
        </div>

        {/* Login Menu */}
        <div className={this.isActive() ? '' : 'hide'}>
          <div className="dropdown-menu-blocker log-in-menu-blocker" onClick={this.toggleMenu}></div>
          <div className="dropdown-menu log-in-menu right-arrow {this.isActive() ? '' : 'hide'}">
            <form className="log-in-form" onSubmit={this.submitLogin}>
              <input type="text" name="email_username" placeholder="Username" ref="username" />
              <input type="password" name="password" placeholder="Password" ref="password" />
              <button className="button tori-login">Sign In</button>
            </form>
            <div className="divider" data-text="or"></div>
            <div className="oauth-buttons">
              <button className="button twitter">
                <i className="fa fa-twitter"></i>
                Sign In With Twitter
              </button>
              <button className="button google">
                <i className="fa fa-google-plus"></i>
                Sign In With Google
              </button>
            </div>
            <div className="divider" data-text="Don't have an account?"></div>
            <a href="/register" className="register-link">Register now</a>
          </div>
        </div>
      </span>
    );
  }
});

export default HeaderAuthentication;
