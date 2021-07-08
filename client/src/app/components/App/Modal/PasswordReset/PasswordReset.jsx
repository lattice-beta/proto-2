import React from 'react';
import PropTypes from 'prop-types';
import axios from '../../../../utils/axios';
import history from '../../../../utils/history';

require('./passwordReset.scss');

class PasswordReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotice: false,
      notice: ''
    };
    this.passwordMatch = this.passwordMatch.bind(this);
    this.passwordMatchFailed = this.passwordMatchFailed.bind(this);
    this.resetToken = this.resetToken.bind(this);
    this.resetResponse = this.resetResponse.bind(this);
  }

  passwordMatch(a, b) {
    return (a === b);
  }

  passwordMatchFailed() {
    this.setState({
      showNotice: true,
      notice: 'Passwords did not match.'
    });
  }

  resetResponse(msg) {
    this.setState({
      showNotice: true,
      notice: msg
    });
  }

  resetToken() {
    const location = this.props.location.pathname;
    const resetToken = location.match(/\/reset\/([\w-].*)/);
    return resetToken ? resetToken[1] : null;
  }

  submitResetPassword(event, password, token) {
    if (this.passwordMatch(this.password.value, this.passwordConfirm.value)) {
      axios.post('/auth/reset', {
        password,
        token
      })
        .then((response) => {
          this.resetResponse(response.data.msg);
        })
      .catch((error) => { // eslint-disable-line
          this.resetResponse(error.response.data.msg);
        });
    } else {
      this.passwordMatchFailed();
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className="reset-modal__content">
        <h1 className="reset-modal__title">Reset Password</h1>
        <form
          onSubmit={(event) => {
            this.submitResetPassword(event, this.password.value, this.resetToken());
            history.push('/');
          }}
        >
          <div className="reset-modal__div">
            <label htmlFor="reset-modal-password" className="reset-modal__label">
              <input
                id="reset-modal-password"
                className="reset-modal__input"
                data-test="reset-modal__password"
                type="password"
                placeholder="new password"
                ref={(password) => { this.password = password; }}
              />
            </label>
            <label htmlFor="reset-modal-confirm" className="reset-modal__label">
              <input
                id="reset-modal-confirm"
                className="reset-modal__input"
                data-test="reset-modal__confirm-password"
                type="password"
                placeholder="confirm password"
                ref={(passwordConfirm) => { this.passwordConfirm = passwordConfirm; }}
              />
            </label>
          </div>
          <div className="reset-modal__buttonholder">
            <button className="forgot-modal__button" type="submit" value="Submit" data-test="reset-modal__submit-button">
              Submit
            </button>
          </div>
        </form>
        {this.state.showNotice && (
          <p className="forgot-modal__notice">
            {this.state.notice}
          </p>
        )}
      </div>
    );
  }
}

PasswordReset.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired
};

export default PasswordReset;
