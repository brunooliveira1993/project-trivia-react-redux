import React, { Component } from 'react';

export default class Login extends Component {
  state = {
    email: '',
    name: '',
    disabledButton: true,
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    }, () => {
      this.setState({
        disabledButton: !this.validateButton(),
      });
    });
  };

  validateEmail = (email) => {
    const regex = /[a-z0-9]+@[a-z]+\.[a-z]/;
    return regex.test(email);
  };

  validateName = (name) => name.length > 0;

  validateButton = () => {
    const { email, name } = this.state;
    return this.validateEmail(email) && this.validateName(name);
  };

  render() {
    const { email, name, disabledButton } = this.state;
    return (
      <div>
        <label htmlFor="email">
          Email:
          <input
            type="text"
            name="email"
            id="email"
            value={ email }
            onChange={ this.handleChange }
            data-testid="input-gravatar-email"
          />
        </label>
        <label htmlFor="name">
          Nome:
          <input
            type="text"
            name="name"
            id="name"
            value={ name }
            onChange={ this.handleChange }
            data-testid="input-player-name"
          />
        </label>
        <button
          type="button"
          disabled={ disabledButton }
          data-testid="btn-play"
        >
          Play
        </button>
      </div>
    );
  }
}
