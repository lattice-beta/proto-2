import * as ActionTypes from '../constants/reduxConstants.js';

import axios from '../utils/axios';

export function updateUserName(event) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_USER_NAME,
      event
    });
  };
}

export function updateUserPassword(event) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_USER_PASSWORD,
      event
    });
  };
}

export function setUserName(name) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_USER_NAME,
      name
    });
  };
}

export function matchUserName(name, projectID) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.MATCH_USER_NAME,
      name,
      projectID
    });
  };
}

export function signUserUp(name, password) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SIGN_USER_UP
    });
  };
}

export function setEditAccess(value) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_EDIT_ACCESS,
      value
    });
  };
}

export function setUserType(value) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_USER_TYPE,
      value
    });
  };
}

export function logoutUser() {
  return dispatch => axios.get('/logout')
    .then(() => {
      dispatch({
        type: ActionTypes.LOGOUT_USER,
      });
    });
}

export function fetchCurrentUser() {
  return dispatch => axios.get('/current_user')
    .then(({ data }) => dispatch({
      type: ActionTypes.SET_USER,
      data
    }));
}
