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

    const credentials = {
      username: this.usernameInput.value,
      password: this.passwordInput.value
    };

    // TODO: some form of basic validation.

    this.props.login(credentials);
  },

  showError() {
    return (
      <div className="error">{this.props.authError}</div>
    );
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
              <input
                type="text"
                name="username"
                placeholder="Username"
                ref={ ref => this.usernameInput = ref }
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                ref={ ref => this.passwordInput = ref }
              />
              {this.props.authError ? this.showError() : null}
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
