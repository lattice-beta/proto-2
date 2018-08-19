import * as ActionTypes from '../constants/reduxConstants.js';

const initialState = {
  editorFontSize: 14,
  editorTheme: 'light'
};
const preferences = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_EDITOR_THEME:
      return Object.assign({}, state, {
        editorTheme: action.value
      });
    case ActionTypes.UPDATE_EDITOR_FONT_SIZE:
      return Object.assign({}, state, {
        editorFontSize: action.value
      });
    case ActionTypes.SET_USER_PREFERENCES:
      return Object.assign({}, state, {
        editorTheme: action.data.editorTheme,
        editorFontSize: action.data.editorFontSize
      });
    default:
      return state;
  }
};
export default preferences;
