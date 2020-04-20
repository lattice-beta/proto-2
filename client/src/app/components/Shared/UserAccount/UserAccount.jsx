import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from '../../App/Modal/Modal.jsx';
import Login from '../../App/Modal/Login/Login.jsx';
import SignUp from '../../App/Modal/SignUp/SignUp.jsx';

import {
  toggleAccountDropdown,
  viewLoginModal,
  viewSignUpModal,
  closeLoginModal,
  closeSignUpModal
} from '../../../action/mainToolbar.js';
import { setPageId } from '../../../action/page.js';
import { logoutUser, setEditAccess, fetchCurrentUser } from '../../../action/user.js';

import AccountSVG from '../../../images/account.svg';
import axios from '../../../utils/axios';
import history from '../../../utils/history';

require('./userAccount.scss');

class UserAccount extends React.Component {
  componentDidMount() {
    this.props.fetchCurrentUser();
  }

  logout = () => {
    this.props.logoutUser(this.props.name).then(() => {
      if (this.props.container === 'app') {
        history.push('/');
      } else if (this.props.container === 'dashboard') {
        window.location.assign('https://www.peblio.co');
      }
    });
  }

  projectID = () => {
    const location = this.props.location ? this.props.location.pathname : '';
    const projectID = location.match(/\/pebl\/([\w-].*)/);
    if (projectID) {
      this.props.setPageId(projectID[1]);
      return projectID[1];
    }
    this.props.setPageId('');
    return null;
  }

  authLoadedPage = () => {
    if (this.projectID()) {
      this.props.setEditAccess(false);
      const projectID = this.projectID();
      axios.get(`/authenticate/${projectID}`)
        .then((res1) => {
          this.props.setEditAccess(res1.data);
        });
    }
  }

  renderListItem = (displayText, link) => (
    <li className="user-account__list-item">
      <a
        className="user-account__link"
        target="_blank"
        rel="noopener noreferrer"
        href={link}
        onMouseDown={(e) => { e.preventDefault(); }}
        onKeyDown={(e) => { e.preventDefault(); }}
        data-test={`user-account__${displayText}-link`}
      >
        {displayText}
      </a>
    </li>
  )

  render() {
    return (
      <div>
        {this.props.name ? (
          <div>
            <button
              onMouseDown={this.props.toggleAccountDropdown}
              onKeyDown={this.props.toggleAccountDropdown}
              onBlur={() => {
                setTimeout(() => {
                  if (this.props.isAccountDropdownOpen) {
                    this.props.toggleAccountDropdown();
                  }
                }, 50);
              }}
              className="user-account__account-button"
              data-test="account-button"
            >
              <div id="google-tm-usertype" className="google-tm-hidden">
                {this.props.userType}
              </div>
              <div id="google-tm-username" className="google-tm-hidden">
                {this.props.name}
              </div>
              <AccountSVG
                alt="account profile"
                className="account-man"
              />
            </button>
            {this.props.isAccountDropdownOpen && (
              <div className="user-account__account">
                <ul className="user-account__list">
                  <li className="user-account__list-item">
                    <p className="user-account__welcome">
                      {`Hi ${this.props.name}!`}
                      <button
                        onMouseDown={this.props.toggleAccountDropdown}
                        onKeyDown={this.props.toggleAccountDropdown}
                        className="user-account__account-button-clicked"
                      >
                        <AccountSVG
                          alt="account profile"
                          className="account-man__clicked"
                        />
                      </button>
                    </p>
                  </li>
                  {this.props.container === 'app' || this.renderListItem('workspace', '/') }
                  {this.props.container === 'dashboard' || this.renderListItem('dashboard', '/dashboard') }
                  {(this.props.userType === 'student') ||
                    this.props.container === 'profile' ||
                    this.renderListItem('profile', `/profile/${this.props.name}`)
                  }
                  <li className="user-account__list-item">
                    <button
                      className="user-account__link"
                      onMouseDown={this.logout}
                      onKeyDown={this.logout}
                      data-test="user-account__logout-button"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="user-account__div-right-inside">
            <button
              className="user-account__button"
              onClick={this.props.viewLoginModal}
              data-test="user-account__login-button"
            >
              Log In
            </button>
            <div className="user-account__spacer"></div>
            <button
              className="user-account__button"
              onClick={this.props.viewSignUpModal}
              data-test="user-account__signup-button"
            >
              Sign Up
            </button>
          </div>
        )}
        <Modal
          size="large"
          isOpen={this.props.isLoginModalOpen}
          closeModal={this.props.closeLoginModal}
        >
          <Login
            authLoadedPage={this.authLoadedPage}
          />
        </Modal>
        <Modal
          size="auto"
          isOpen={this.props.isSignUpModalOpen}
          closeModal={this.props.closeSignUpModal}
        >
          <SignUp
            authLoadedPage={this.authLoadedPage}
          />
        </Modal>
      </div>
    );
  }
}

UserAccount.propTypes = {
  closeLoginModal: PropTypes.func.isRequired,
  closeSignUpModal: PropTypes.func.isRequired,
  container: PropTypes.string.isRequired,
  fetchCurrentUser: PropTypes.func.isRequired,
  isAccountDropdownOpen: PropTypes.bool.isRequired,
  isLoginModalOpen: PropTypes.bool.isRequired,
  isSignUpModalOpen: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  logoutUser: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  setEditAccess: PropTypes.func.isRequired,
  setPageId: PropTypes.func.isRequired,
  toggleAccountDropdown: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
  viewLoginModal: PropTypes.func.isRequired,
  viewSignUpModal: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    isAccountDropdownOpen: state.mainToolbar.isAccountDropdownOpen,
    name: state.user.name,
    userType: state.user.type,
    isLoginModalOpen: state.mainToolbar.isLoginModalOpen,
    isSignUpModalOpen: state.mainToolbar.isSignUpModalOpen,
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({
  closeLoginModal,
  closeSignUpModal,
  fetchCurrentUser,
  logoutUser,
  setEditAccess,
  setPageId,
  viewLoginModal,
  viewSignUpModal,
  toggleAccountDropdown,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount);
