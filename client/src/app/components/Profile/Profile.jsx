import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Details from './Details/Details.jsx';
import Pebls from './Pebls/Pebls.jsx';

import * as profileActions from '../../action/profile.js';
import * as userActions from '../../action/user.js';

import axios from '../../utils/axios';

require('./profile.scss');

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userType: 'student'
    };
    this.loadProfileDetails = this.loadProfileDetails.bind(this);
  }

  componentWillMount() {
    this.loadProfileDetails();
  }

  profileName() {
    const location = this.props.location.pathname;
    const profileName = location.match(/\/user\/([\w-].*)/);
    return profileName ? profileName[1] : null;
  }

  loadProfileDetails() {
    if (this.profileName()) {
      const profileName = this.profileName();
      axios.get(`/profile/user/${profileName}`)
        .then((res) => {
          this.props.setProfileName(res.data.name);
          this.props.setUserImage(res.data.image);
          this.props.setUserBlurb(res.data.blurb);
          this.setState({ userType: res.data.type });
          axios.get('/user')
            .then((res1) => {
              if (res1.data.name === this.props.name) {
                this.props.setIsOwner(true);
              }
            });
        });
    }
  }

  render() {
    this.state.userName = this.profileName();
    return (
      <div>
        {
          !(this.state.userType === 'student') && (
            <div className="profile__container">
              <Details
                isOwner={this.props.isOwner}
                name={this.props.name}
                image={this.props.image}
                setUserImage={this.props.setUserImage}
                setUserBlurb={this.props.setUserBlurb}
                blurb={this.props.blurb}
              />
              <Pebls
                profileName={this.state.userName}
              />
            </div>
          )}
      </div>
    );
  }
}

Profile.propTypes = {
  blurb: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  isOwner: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  setIsOwner: PropTypes.func.isRequired,
  setUserImage: PropTypes.func.isRequired,
  setProfileName: PropTypes.func.isRequired,
  setUserBlurb: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    image: state.user.image,
    isOwner: state.profile.isOwner,
    name: state.profile.name,
    blurb: state.user.blurb
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    profileActions,
    userActions),
  dispatch);
}
export default (connect(mapStateToProps, mapDispatchToProps)(Profile));
