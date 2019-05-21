import * as ActionTypes from '../constants/reduxConstants.js';

const initialState = {
  dashboardView: 'documents',
  documentView: 'block',
  documentSort: 'updatedAt'
};
const dashboard = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_DASHBOARD_VIEW:
      return Object.assign({}, state, {
        dashboardView: action.viewName
      });

    case ActionTypes.SET_DOCUMENT_VIEW:
      return Object.assign({}, state, {
        documentView: action.viewType
      });

    case ActionTypes.SET_DOCUMENT_SORT:
      return Object.assign({}, state, {
        documentSort: action.sortType
      });

    default:
      return state;
  }
};
export default dashboard;
