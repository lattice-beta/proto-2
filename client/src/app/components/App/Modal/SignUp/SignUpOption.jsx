import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveLog } from '../../../../utils/log';
import { closeSignUpModal } from '../../../../action/mainToolbar.js';
import GoogleSignupButton from '../../Shared/GoogleButton/GoogleSignupButton.jsx';
import { setUserName, setUserType } from '../../../../action/user.js';
import { setNextScreen } from '../../../../action/user.js';

class SignUpOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotice: false,
      notice: ''
    };
  }

  onClick = () => {
    this.props.setNextScreen('PeblioSignUpForm');
  }

  signUpFailed = (error) => {
    this.setState({
      showNotice: true,
      notice: error.response.data.msg
    });
  }

  googleLoginSuccessful = (response) => {
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
  }

  render() {
    return (
      <div>
        <h2 className="signup-modal__subtitle">
          Almost signed up!
        </h2>
        <GoogleSignupButton
          onLoginSuccess={this.googleLoginSuccessful}
          onLoginFailure={this.signUpFailed}
          userType={this.props.userType}
          requiresGuardianConsent={this.props.requiresGuardianConsent}
          guardianEmail={this.props.guardianEmail}
          name={this.props.tempUsername}
          setUserName={this.props.setUserName}
          setUserType={this.props.setUserType}
          closeSignUpModal={this.props.closeSignUpModal}
        />
        <div className="signup-modal__or-container">
          <hr className="signup-modal__or-line" />
          <p className="signup-modal__or">
            or
          </p>
          <hr className="signup-modal__or-line" />
        </div>
        <div className="signup-modal__buttonholder">
          <button
            className="signup-modal__peblio-button"
            onClick={this.onClick}
            data-test="signup-modal__button-peblio"
          >
            Sign in with Peblio
          </button>
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

SignUpOption.propTypes = {
  closeSignUpModal: PropTypes.func.isRequired,
  setNextScreen: PropTypes.func.isRequired,
  guardianEmail: PropTypes.string,
  requiresGuardianConsent: PropTypes.bool,
  userType: PropTypes.string.isRequired,
  tempUsername: PropTypes.string.isRequired,
  setUserName: PropTypes.func.isRequired,
  setUserType: PropTypes.func.isRequired,
};

SignUpOption.defaultProps = {
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
  setNextScreen,
  setUserName,
  setUserType,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignUpOption);
