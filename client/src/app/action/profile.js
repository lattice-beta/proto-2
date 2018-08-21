import * as ActionTypes from '../constants/reduxConstants.js';
import axios from '../utils/axios';

export function setIsOwner(value) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_IS_OWNER,
      value
    });
  };
}

export function fetchProfile(userName) {
  return dispatch => axios.get(`/users/${userName}/profile`)
    .then(({ data }) => dispatch({
      type: ActionTypes.SET_PROFILE,
      data
    }));
}

export function setProfileBlurb(value) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_PROFILE_BLURB,
      value
    });
  };
}

export function updateProfileBlurb(value) {
  return dispatch => axios.put('/currentUser/profile', {
    blurb: value
  }).then(() => dispatch({
    type: ActionTypes.SET_PROFILE_BLURB,
    value
  }));
}

export function updateProfileImage(value) {
  return dispatch => axios.put('/currentUser/profile', {
    image: value,
  }).then(() => dispatch({
    type: ActionTypes.SET_PROFILE_IMAGE,
    value
  }));
}
