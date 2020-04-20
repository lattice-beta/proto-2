import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import axios from '../../../../utils/axios';
import { setUserName, setUserType } from '../../../../action/user.js';
import { closeLoginModal, viewForgotModal } from '../../../../action/mainToolbar.js';
import GoogleLoginButton from '../../Shared/GoogleButton/GoogleLoginButton.jsx';
import { saveLog } from '../../../../utils/log';

require('./login.scss');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotice: false,
      notice: ''
    };
    this.loginSuccessful = this.loginSuccessful.bind(this);
    this.loginFailed = this.loginFailed.bind(this);
  }

  componentWillUnmount() {
    this.props.authLoadedPage();
  }

  loginFailed(error) {
    this.setState({
      showNotice: true,
      notice: error.response.data.msg
    });
  }

  loginSuccessful(response) {
    this.props.setUserName(response.data.user.name);
    this.props.setUserType(response.data.user.type);
    this.props.closeLoginModal();
  }

  submitLoginUser(event, name, password) {
    axios.post('/auth/login', {
      name,
      password
    })
      .then(this.loginSuccessful)
      .then(() => {
        const log = {
          message: 'User Logged In',
          path: '/auth/login',
          action: 'LoginUser',
          module: 'ui',
          level: 'INFO',
          user: name
        };
        saveLog(log);
      })
      .catch(this.loginFailed);
    event.preventDefault();
  }

  render() {
    return (
      <div className="login-modal__content">
        <h1 className="login-modal__title">Log In</h1>
        <GoogleLoginButton
          onLoginSuccess={this.loginSuccessful}
          onLoginFailure={this.loginFailed}
        />
        <p className="login-modal__text-secondary">or</p>
        <form onSubmit={(event) => { this.submitLoginUser(event, this.userName.value, this.userPassword.value); }}>
          <div className="login-modal__div">
            <input
              id="login-modal-name"
              className="login-modal__input"
              type="text"
              placeholder="Username/Email"
              ref={(userName) => { this.userName = userName; }}
            />
          </div>
          <div className="login-modal__div">
            <input
              id="login-modal-password"
              className="login-modal__input"
              type="password"
              placeholder="password"
              ref={(userPassword) => { this.userPassword = userPassword; }}
            />
          </div>

          <div className="login-modal__buttonholder">

            <button className="forgot-modal__button" type="submit" value="Submit" data-test="submit-login">
              Submit
            </button>
            <button
              className="login-modal__forgot-link"
              onClick={() => {
                this.props.viewForgotModal();
                this.props.closeLoginModal();
              }}
            >
              forgot password?
            </button>
          </div>
        </form>


        {this.state.showNotice && (
          <p className="forgot-modal__notice">
            {ReactHtmlParser(this.state.notice)}
          </p>
        )}
      </div>
    );
  }
}

Login.propTypes = {
  authLoadedPage: PropTypes.func.isRequired,
  closeLoginModal: PropTypes.func.isRequired,
  setUserName: PropTypes.func.isRequired,
  setUserType: PropTypes.func.isRequired,
  viewForgotModal: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators({
  closeLoginModal,
  setUserName,
  setUserType,
  viewForgotModal
}, dispatch);

export default connect(null, mapDispatchToProps)(Login);
