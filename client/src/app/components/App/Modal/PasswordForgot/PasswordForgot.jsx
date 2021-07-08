import React from 'react';
import axios from '../../../../utils/axios';

require('./passwordForgot.scss');

class PasswordForgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotice: false,
      notice: ''
    };
    this.emailResponse = this.emailResponse.bind(this);
  }

  emailResponse(msg) {
    this.setState({
      showNotice: true,
      notice: msg
    });
  }

  submitForgotPassword(event, email) {
    axios.post('/auth/forgot', {
      email
    })
      .then((response) => {
        this.emailResponse(response.data.msg);
      })
      .catch((error) => {
        this.emailResponse(error.response.data.msg);
      });
    event.preventDefault();
  }

  render() {
    return (
      <div className="forgot-modal__content">
        <h1 className="forgot-modal__title">Forgot Password?</h1>
        <div className="forgot-modal__text">
          Enter your email address and we&lsquo;ll send you a link to reset your password.
        </div>
        <form onSubmit={(event) => { this.submitForgotPassword(event, this.email.value); }}>
          <div className="forgot-modal__div">
            <label htmlFor="forgot-modal-email" className="forgot-modal__label">
              <input
                id="forgot-modal-email"
                className="forgot-modal__input"
                data-test="forgot-password-email"
                type="text"
                placeholder="email"
                ref={(email) => { this.email = email; }}
              />
            </label>
          </div>
          <div className="forgot-modal__buttonholder">
            <button className="forgot-modal__button" type="submit" value="Submit" data-test="forgot-password-submit">
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

export default PasswordForgot;
