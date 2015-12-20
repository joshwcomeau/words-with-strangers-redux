import React from 'react';
import Formsy from 'formsy-react';

const FloatingTextField = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue(event) {
    this.setValue(event.currentTarget.value);
  },

  renderError() {
    let errorMessage = this.getErrorMessage();
    return <span className="error-message">{errorMessage}</span>;
  },

  render() {
    let inputClasses = ["user-field"];

    // If the input has data in it, we need to apply some classes
    if ( this.getValue() ) {
      inputClasses.push('filled');
      inputClasses.push( this.isValid() ? 'valid' : 'invalid' );
    }

    return (
      <div className="floating-input">
        <input
        type={this.props.type}
        name={this.props.name}
        id={this.props.name}
        className={inputClasses.join(' ')}
        autoComplete="false"
        onChange={this.changeValue}
        value={this.getValue()}
        />

      <label htmlFor={this.props.name}>{this.props.label}</label>

      { this.showError() ? this.renderError() : null }
      </div>
    );
  }
});

export default FloatingTextField
