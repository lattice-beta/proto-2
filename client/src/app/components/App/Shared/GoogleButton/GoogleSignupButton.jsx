import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import axios from '../../../../utils/axios';
import './googleLoginButton.scss';

class GoogleSignupButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    window.gapi.load('auth2', () => {
      this.auth2 = window.gapi.auth2.init({ client_id: process.env.GOOGLE_CLIENT_ID });
    });
  }

  signIn = (response) => {
    const closeSignUpModal = this.props.closeSignUpModal;
    const setUserName = this.props.setUserName;
    const setUserType = this.props.setUserType;
    return axios.post('/auth/login/google', {
      google_id_token: response.data.google_id_token,
    })
      .then(() => {
        closeSignUpModal();
        setUserName(response.data.user.name);
        setUserType(response.data.user.type);
      });
  }

  handleClick = () => {
    this.auth2.signIn()
      .then((googleUser) => {
        const idToken = googleUser.getAuthResponse().id_token;
        return axios.post('/auth/signin/google', {
          userType: this.props.userType,
          requiresGuardianConsent: this.props.requiresGuardianConsent,
          guardianEmail: this.props.guardianEmail,
          google_id_token: idToken,
          name: this.props.name
        });
      })
      .then(this.signIn)
      .catch(this.props.onLoginFailure);
  }

  render() {
    return (
      <button className="google-login-button" onClick={this.handleClick}>
        <Helmet>
          <script src="https://apis.google.com/js/platform.js" async defer></script>
        </Helmet>
      </button>
    );
  }
}

GoogleSignupButton.propTypes = {
  guardianEmail: PropTypes.string,
  onLoginFailure: PropTypes.func.isRequired,
  requiresGuardianConsent: PropTypes.bool.isRequired,
  userType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setUserName: PropTypes.func.isRequired,
  setUserType: PropTypes.func.isRequired,
  closeSignUpModal: PropTypes.func.isRequired,
};

GoogleSignupButton.defaultProps = {
  guardianEmail: null
};

export default GoogleSignupButton;
