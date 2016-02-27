import React from 'react';
import Formsy from 'formsy-react';

import FloatingTextField from '../form/FloatingTextField.jsx'

const Register = React.createClass({
  componentWillReceiveProps(nextProps) {
    // If the form is submitted but the server rejects the submission,
    // the props will be updated, and the auth object will have an 'error'
    // property. We'll use that property to invalidate Formsy as necessary.
    if ( nextProps.error ) {
      let errors = {};

      console.log(nextProps.error)

      switch(nextProps.error.type) {
        case 'duplicate_username':
          errors = {username: 'Sorry, someone else has already taken that username. What a jerk.'};
          break;
        case 'reserved_username':
          errors = {username: 'Sorry, that username is a reserved word =('};
          break;
        default:
          errors = {username: 'Oh no! A miscellaneous server error has occured.'};
          break;
      }

      this.form.updateInputsWithError(errors);
    }
  },

  submit(model, reset, invalidate) {
    this.props.register(model)
  },

  // Wrap our prop methods for enabling/disabling registration, so that we
  // can check the state and see if they're necessary. No sense polluting
  // the state history with a bunch of inconsequential changes.
  enableRegistration() {
    if ( !this.props.registrationEnabled ) this.props.enableRegistration();
  },
  disableRegistration() {
    if ( this.props.registrationEnabled ) this.props.disableRegistration();
  },


  render() {
    return (
      <div id="register">
        <div className="card">
          <div className="card-header">
            <h1>Registration</h1>
            <h3>The world's shortest signup form.</h3>
          </div>
          <div className="card-body">
            <Formsy.Form
              ref={ ref => this.form = ref }
              onValidSubmit={this.submit}
              onValid={this.enableRegistration}
              onInvalid={this.disableRegistration}
            >
              {/* fake fields are a workaround for chrome autofill getting the wrong fields */}
              <input style={{ display: "none" }} type="text" name="fakeusernameremembered"/>
              <input style={{ display: "none" }} type="password" name="fakepasswordremembered"/>

              <FloatingTextField
                name="username"
                type="text"
                label="Choose a Username"
                validations={{
                  isAlphanumeric: true,
                  maxLength: 30
                }}
                validationErrors={{
                  isAlphanumeric: "Our deepest apologies, but usernames can only contain letters and numbers.",
                  maxLength: "Egad! That username is too long. Keep it under 30, please."
                }}
                required
              />

              <FloatingTextField
                name="password"
                type="password"
                label="Choose a Password"
                validations={{
                  minLength: 8,
                  maxLength: 50
                }}
                validationErrors={{
                  minLength: "Gotta be at least 8 characters.",
                  maxLength: "Woah there, cowboy. Password length is limited to 50 characters."
                }}
                required
              />

              <button type="submit" className="button continue" disabled={!this.props.registrationEnabled}>
                <i className="fa fa-caret-right right"></i>
                Register
              </button>
            </Formsy.Form>
          </div>
        </div>
      </div>
    );
  }
});

export default Register;
