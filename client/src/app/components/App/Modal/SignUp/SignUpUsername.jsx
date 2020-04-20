import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from '../../../../utils/axios';
import { setNextScreen } from '../../../../action/user.js';

class SignUpUsername extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotice: false,
      notice: ''
    };
  }

  onNextButtonClick = () => {
    axios.post('/auth/checkusername', {
      name: this.userName.value
    })
      .then(() => {
        if (this.userName.value && this.userName.value !== '') {
          this.props.setTempUserName(this.userName.value);
          this.props.setNextScreen('SignupOption');
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          this.userNameUnavailable(err.response.data.msg);
        }
      });
  }

  userNameUnavailable = (msg) => {
    this.setState({
      showNotice: true,
      notice: msg
    });
  }

  render() {
    return (
      <div className="signup-modal__username">
        <h2 className="signup-modal__subtitle">
          Create your username
        </h2>
        <div className="signup-modal__div">
          <input
            required
            className="signup-modal__input"
            data-test="signup-modal__input-name"
            id="signup-modal-name"
            placeholder="username"
            ref={(userName) => { this.userName = userName; }}
            type="text"
          />
        </div>
        <div className="signup-modal__buttonholder">
          <button
            className="signup-modal__button"
            data-test="signup-modal__button-next"
            onClick={this.onNextButtonClick}
            value="Submit"
          >
            Next
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

SignUpUsername.propTypes = {
  setTempUserName: PropTypes.func.isRequired,
  setNextScreen: PropTypes.func.isRequired
};

function mapStateToProps() {
  return {};
}

const mapDispatchToProps = dispatch => bindActionCreators({
  setNextScreen
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignUpUsername);
