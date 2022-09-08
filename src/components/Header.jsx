import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';

class Header extends Component {
  state = {
    gravatarImgUrl: '',
  };

  componentDidMount() {
    const { email } = this.props;
    const teste = md5(email).toString();
    console.log(teste);
    this.setState({
      gravatarImgUrl: `https://www.gravatar.com/avatar/${teste}`,
    });
  }

  render() {
    const { name, email, score } = this.props;
    const { gravatarImgUrl } = this.state;
    return (
      <div>
        <h2>{email}</h2>
        <img
          data-testid="header-profile-picture"
          src={ gravatarImgUrl }
          alt="gravatar generated"
        />
        <h2 data-testid="header-player-name">{name}</h2>
        <h2 data-testid="header-score">{score}</h2>
      </div>
    );
  }
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.player.name,
  email: state.player.gravatarEmail,
  score: state.player.score,
});

export default connect(mapStateToProps)(Header);
