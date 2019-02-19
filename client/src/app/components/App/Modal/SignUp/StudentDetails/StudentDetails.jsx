import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { setStudentBirthday, setGuardianEmail } from '../../../../../action/user.js';


class StudentDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: 0,
      year: 1992
    };
  }

  handleMonthChange = (month) => {
    this.setState({ month });
    const startDate = moment([this.state.year, month]);
    this.handleChange(startDate);
  }

  handleYearChange = (year) => {
    this.setState({ year });
    const startDate = moment([year, this.state.month]);
    this.handleChange(startDate);
  }

  handleChange=(startDate) => {
    const endDate = moment(startDate).endOf('month');
    const date = endDate.toDate();
    this.props.setStudentBirthday(date);
    const today = moment();
    const birthday = moment(date);
    const age = today.diff(birthday, 'years');
    if (age < 13) {
      this.props.setGuardianConsent(true);
    } else {
      this.props.setGuardianConsent(false);
    }
  }

  renderMonthDropdown() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return (
      <select
        className="signup-modal__dropdown"
        onChange={(e) => { this.handleMonthChange(e.target.value); }}
        ref={(birthdayMonth) => { this.birthdayMonth = birthdayMonth; }}
        data-test="signup-modal__month-dropdown"
      >
        {months.map((month, i) => (
          <option value={i}>{month}</option>
        ))}
      </select>
    );
  }


  renderYearDropdown() {
    const currentYear = moment().year();
    return (
      <select
        className="signup-modal__dropdown"
        onChange={(e) => { this.handleYearChange(e.target.value); }}
        ref={(birthdayYear) => { this.birthdayYear = birthdayYear; }}
        data-test="signup-modal__year-dropdown"
      >
        {
          Array.from({ length: 100 }, (v, k) => (<option value={currentYear - k}>{currentYear - k}</option>))
        }
      </select>
    );
  }

  render() {
    return (
      <div>
        <div className="signup-modal__birthday">
          <p className="signup-modal__input-text">
          Birthday
          </p>
          {this.renderMonthDropdown()}
          {this.renderYearDropdown()}
        </div>
        {this.props.requiresGuardianConsent && (
          <div className="signup-modal__div">
            {/* eslint-disable */}
              <p className="signup__notice">
                {'Enter your parent\'s or guardian\'s email address and we will send them an email to confirm this account'}
              </p>
            {/* eslint-enable */}
            <input
              required
              className="signup-modal__input"
              id="signup-modal-guardian-mail"
              placeholder="Parent/Guardian email"
              ref={(guardianEmail) => { this.guardianEmail = guardianEmail; }}
              type="email"
              onChange={(e) => {
                this.props.setGuardianEmail(e.target.value);
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

StudentDetails.propTypes = {
  requiresGuardianConsent: PropTypes.bool.isRequired,
  setGuardianConsent: PropTypes.func.isRequired,
  setStudentBirthday: PropTypes.func.isRequired,
  setGuardianEmail: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    requiresGuardianConsent: state.user.requiresGuardianConsent,
    studentBirthday: state.user.studentBirthday
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({
  setStudentBirthday,
  setGuardianEmail
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StudentDetails);
