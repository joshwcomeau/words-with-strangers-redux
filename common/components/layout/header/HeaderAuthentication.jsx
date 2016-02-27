import React from 'react';
import { Link } from 'react-router';

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
      <div className="error-message">{this.props.error.details}</div>
    );
  },

  clickRegister() {

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
              {this.props.error ? this.showError() : null}
              <button className="button tori-login">Sign In</button>
            </form>
            <div className="divider" data-text="Don't have an account?"></div>
            <Link
              to="/register"
              className="register-link"
              onClick={this.props.closeMenu}>
                Register now
            </Link>
          </div>
        </div>
      </span>
    );
  }
});

export default HeaderAuthentication;
