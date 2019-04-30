import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Account from './Account/Account';
import Documents from './Documents/Documents';
import Profile from '../Profile/Profile';
import Nav from './Nav/Nav';

import * as profileActions from '../../action/profile';
import * as userActions from '../../action/user';

import './dashboard.scss';

class Dashboard extends React.Component {
  componentWillMount() {
    this.props.fetchCurrentUser()
      .then(() => {
        this.props.fetchProfile(this.props.name);
        console.log(this.props.name);
      });
    // const userName = this.props.match.params.userName;
    // if (!userName) {
    //   return;
    // }
    // this.props.fetchProfile(userName);
  }

  renderDashboardView=(dashboardView) => {
    const userName = this.props.match.params.userName;
    switch (dashboardView) {
      case 0:
        return (
          <Documents
            profileName={this.props.name}
            folderShortId={this.props.match.params.folderShortId}
          />
        );
      case 1: return (
        <Account
          name={this.props.name}
          image={this.props.image}
          blurb={this.props.blurb}
          updateProfileImage={this.props.updateProfileImage}
          updateProfileBlurb={this.props.updateProfileBlurb}
          setProfileBlurb={this.props.setProfileBlurb}
        />
      );
      case 3: return (
        <Profile />
      );
    }
  }

  render() {
    return (
      <div>
        <div className="dashboard__container">
          <Nav />

          {this.renderDashboardView(1)}

        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  blurb: PropTypes.string.isRequired,
  dashboardView: PropTypes.number.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
  isOwner: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  setProfileBlurb: PropTypes.func.isRequired,
  updateProfileBlurb: PropTypes.func.isRequired,
  updateProfileImage: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    image: state.user.image,
    name: state.user.name,
    blurb: state.user.blurb,
    dashboardView: state.dashboard.dashboardView
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    profileActions,
    userActions),
  dispatch);
}
export default (connect(mapStateToProps, mapDispatchToProps)(Dashboard));
