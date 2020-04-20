import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from '../../../../utils/axios';
import { saveLog } from '../../../../utils/log';
import { closeSignUpModal } from '../../../../action/mainToolbar.js';
import { setUserName, setUserType } from '../../../../action/user.js';
import GoogleSignupButton from '../../Shared/GoogleButton/GoogleSignupButton.jsx';

require('./signup.scss');

class PeblioSignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotice: false,
      notice: ''
    };
  }

  passwordMatch = (a, b) => (a === b)

  passwordMatchFailed = () => {
    this.setState({
      showNotice: true,
      notice: 'Passwords did not match.'
    });
  }

  signUpFailed = (error) => {
    console.log('In google signup failed');
    this.setState({
      showNotice: true,
      notice: error.response.data.msg
    });
  }

  signUpSuccessful = (msg) => {
    this.setState({
      showNotice: true,
      notice: msg
    });
  }

  googleLoginSuccessful = (response) => {
    console.log('In googleLoginSuccessful');
    axios.post('/auth/login/google', {
      google_id_token: response.data.google_id_token,
    })
      .then(() => {
        this.props.closeSignUpModal();
        const log = {
          message: 'User Logged In using Google',
          path: '/auth/login',
          action: 'LoginUserWithGoogle',
          module: 'ui',
          level: 'INFO',
          user: response.data.user.name
        };
        saveLog(log);
        this.props.setUserName(response.data.user.name);
        this.props.setUserType(response.data.user.type);
      });
  }

  loginFailed = (error) => {
    this.setState({
      showNotice: true,
      notice: error.response.data.msg
    });
  }

  loginSuccessful = (response) => {
    this.props.setUserName(response.data.user.name);
    this.props.setUserType(response.data.user.type);
    this.props.closeSignUpModal();
  }

  submitSignUpUser = (event) => {
    const loginData = {
      mail: this.userMail ? this.userMail.value : this.props.guardianEmail,
      name: this.props.tempUsername,
      userType: this.props.userType,
      password: this.password.value,
      requiresGuardianConsent: this.props.requiresGuardianConsent,
      guardianEmail: this.props.guardianEmail,
      studentBirthday: this.props.studentBirthday
    };
    if (this.passwordMatch(this.password.value, this.passwordConfirm.value)) {
      axios.post('/auth/signup', { ...loginData })
        .then(res => this.signUpSuccessful(res.data.msg))
        .then(() => {
          if (this.props.userType === 'student') {
            axios.post('/auth/login', {
              name: this.props.tempUsername,
              password: this.password.value
            })
              .then(this.loginSuccessful)
              .then(() => {
                const log = {
                  message: 'User Logged In',
                  path: '/auth/login',
                  action: 'LoginUser',
                  module: 'ui',
                  level: 'INFO',
                  user: this.props.tempUsername
                };
                saveLog(log);
              })
              .catch(this.loginFailed);
            event.preventDefault();
          }
        })
        .then(() => {
          const log = {
            message: 'User Signed up',
            path: '/auth/signup',
            action: 'Signup User',
            module: 'ui',
            level: 'INFO',
            user: this.props.tempUsername
          };
          saveLog(log);
        })
        .catch(this.signUpFailed);
    } else {
      this.passwordMatchFailed();
    }
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h2 className="signup-modal__subtitle">
          Almost signed up!
        </h2>
        <GoogleSignupButton
          onLoginFailure={this.signUpFailed}
          userType={this.props.userType}
          requiresGuardianConsent={this.props.requiresGuardianConsent}
          guardianEmail={this.props.guardianEmail}
          closeSignUpModal={this.props.closeSignUpModal}
          setUserName={this.props.setUserName}
          setUserType={this.props.setUserType}
          name={this.props.tempUsername}
        />
        <div className="signup-modal__or-container">
          <hr className="signup-modal__or-line" />
          <p className="signup-modal__or">
            or
          </p>
          <hr className="signup-modal__or-line" />
        </div>
        <div>
          {this.props.guardianEmail === null && (
            <div className="signup-modal__div">
              <input
                required
                className="signup-modal__input"
                data-test="signup-modal__input-email"
                id="signup-modal-mail"
                placeholder="email"
                ref={(userMail) => { this.userMail = userMail; }}
                type="email"
              />
            </div>
          )}
          <div className="signup-modal__div">
            <input
              required
              className="signup-modal__input"
              data-test="signup-modal__input-pswd"
              id="signup-modal-password"
              placeholder="password"
              ref={(password) => { this.password = password; }}
              type="password"
            />
            <input
              required
              id="signup-modal-confirm"
              className="signup-modal__input"
              data-test="signup-modal__input-pswd-confirm"
              placeholder="retype password"
              type="password"
              ref={(passwordConfirm) => { this.passwordConfirm = passwordConfirm; }}
            />
          </div>
          <div className="signup-modal__buttonholder">
            <button
              className="signup-modal__peblio-button"
              data-test="signup-modal__button-submit"
              onClick={this.submitSignUpUser}
              value="Submit"
            >
              Sign in with Peblio
            </button>
          </div>
        </div>
        {this.state.showNotice && (
          <p className="signup-modal__notice">
            {this.state.notice}
          </p>
        )}
      </div>
    );
  }
}

PeblioSignUpForm.propTypes = {
  closeSignUpModal: PropTypes.func.isRequired,
  guardianEmail: PropTypes.string,
  requiresGuardianConsent: PropTypes.bool,
  userType: PropTypes.string.isRequired,
  tempUsername: PropTypes.string.isRequired,
  studentBirthday: PropTypes.string,
  setUserName: PropTypes.func.isRequired,
  setUserType: PropTypes.func.isRequired,
};

PeblioSignUpForm.defaultProps = {
  studentBirthday: null,
  requiresGuardianConsent: null,
  guardianEmail: null
};


function mapStateToProps(state) {
  return {
    requiresGuardianConsent: state.user.requiresGuardianConsent,
    userType: state.user.type,
    studentBirthday: state.user.studentBirthday,
    guardianEmail: state.user.guardianEmail,
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  closeSignUpModal,
  setUserName,
  setUserType,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PeblioSignUpForm);
