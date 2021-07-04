import * as ActionTypes from '../constants/reduxConstants.js';
import { setUnsavedChanges } from './page.js';
import { viewForkPrompt } from './mainToolbar.js';

/** ALL */
export function setCurrentWidget(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_CURRENT_WIDGET,
      id
    });
  };
}


export function removeWidget(id) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.REMOVE_WIDGET,
      id
    });
  };
}

export function closeDeleteWidgetWarning(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.CLOSE_DELETE_WIDGET_WARNING,
      id
    });
  };
}

export function openDeleteWidgetWarning(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.OPEN_DELETE_WIDGET_WARNING,
      id
    });
  };
}

export function duplicateWidget(id) {
  return (dispatch, getState) => {
    const { editorsReducer } = getState();
    const duplicateWidgetId = `editor-${editorsReducer.editorIndex}`;
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.DUPLICATE_WIDGET,
      originalEditorId: id,
      duplicateWidgetId
    });
  };
}

export function loadWidgets(editors, editorIndex) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_DB_EDITORS,
      editors,
      editorIndex
    });
  };
}

export function toggleWidgetFullscreen(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.TOGGLE_WIDGET_FULLSCREEN,
      id
    });
  };
}

/** CODE EDITOR */

export function viewEditorPreview(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.VIEW_EDITOR_PREVIEW,
      id
    });
  };
}

export function addCodeEditor(mode) {
  return (dispatch, getState) => {
    const { editorsReducer } = getState();
    const currentId = editorsReducer.currentWidget;
    const newEditorId = `editor-${editorsReducer.editorIndex}`;
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.ADD_CODE_EDITOR,
      mode
    });
    dispatch({
      type: ActionTypes.ADD_WIDGET,
      currentId,
      newEditorId
    });
  };
}

export function addFileToEditor(id, name, content) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.ADD_FILE_TO_EDITOR,
      id,
      name,
      content
    });
  };
}

export function deleteFileFromEditor(id, index) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.DELETE_FILE_FROM_EDITOR,
      id,
      index
    });
  };
}

export function playCode(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.PLAY_CODE,
      id
    });
  };
}

export function enablePythonInteractiveRunMode(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.ENABLE_PYTHON_INTERACTIVE_RUN_MODE,
      id
    });
  };
}

export function disablePythonInteractiveRunMode(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.DISABLE_PYTHON_INTERACTIVE_RUN_MODE,
      id
    });
  };
}

export function stopCode(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.STOP_CODE,
      id
    });
  };
}

export function startCodeRefresh(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.START_CODE_REFRESH,
      id
    });
  };
}

export function stopCodeRefresh(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.STOP_CODE_REFRESH,
      id
    });
  };
}

export function updateConsoleOutput(id, event) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_CONSOLE_OUTPUT,
      id,
      event
    });
  };
}

export function updateConsoleOutputForPython(id, output) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_CONSOLE_OUTPUT_FOR_PYTHON,
      id,
      output
    });
  };
}

export function clearConsoleOutput(id) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.CLEAR_CONSOLE_OUTPUT,
      id
    });
  };
}

export function updateFile(id, index, content) {
  return (dispatch) => {
    dispatch(viewForkPrompt());
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.UPDATE_FILE,
      id,
      index,
      content
    });
  };
}

export function setCurrentFile(id, index) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_CURRENT_FILE,
      id,
      index
    });
  };
}

export function openFileView(id, index) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.OPEN_FILE_VIEW,
      id,
      index
    });
  };
}

export function closeFileView(id, index) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.CLOSE_FILE_VIEW,
      id,
      index
    });
  };
}

export function setInnerWidth(id, value) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.SET_INNER_WIDTH,
      id,
      value
    });
  };
}

export function addMediaFile(id, name, link) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.ADD_MEDIA_FILE,
      id,
      name,
      link
    });
  };
}
/** TEXT EDITOR */
export function addTextEditor() {
  return (dispatch, getState) => {
    const { editorsReducer } = getState();
    const currentId = editorsReducer.currentWidget;
    const newEditorId = `editor-${editorsReducer.editorIndex}`;
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.ADD_TEXT_EDITOR
    });
    dispatch({
      type: ActionTypes.ADD_WIDGET,
      currentId,
      newEditorId
    });
  };
}

export function updateTextChange(id, state) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.UPDATE_TEXT_CHANGE,
      id,
      state
    });
  };
}

export function updateTextBackColor(id, color) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.UPDATE_TEXT_BACK_COLOR,
      id,
      color
    });
  };
}

export function setEditorView(id, value) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.SET_EDITOR_VIEW,
      id,
      value
    });
  };
}

/** QUESTION EDITOR */
export function addQuestionEditor() {
  return (dispatch, getState) => {
    const { editorsReducer } = getState();
    const currentId = editorsReducer.currentWidget;
    const newEditorId = `editor-${editorsReducer.editorIndex}`;
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.ADD_QUESTION_EDITOR
    });
    dispatch({
      type: ActionTypes.ADD_WIDGET,
      currentId,
      newEditorId
    });
  };
}

export function setQuestionInnerHeight(id, value) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.SET_QUESTION_INNER_HEIGHT,
      id,
      value
    });
  };
}
export function updateQuestionChange(id, text) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.UPDATE_QUESTION_CHANGE,
      id,
      text
    });
  };
}

export function updateAnswerChange(id, text) {
  return (dispatch) => {
    dispatch(viewForkPrompt());
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.UPDATE_ANSWER_CHANGE,
      id,
      text
    });
  };
}

/** IFRAME */
export function addIframe() {
  return (dispatch, getState) => {
    const { editorsReducer } = getState();
    const currentId = editorsReducer.currentWidget;
    const newEditorId = `editor-${editorsReducer.editorIndex}`;
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.ADD_IFRAME
    });
    dispatch({
      type: ActionTypes.ADD_WIDGET,
      currentId,
      newEditorId
    });
  };
}

export function setIframeURL(id, url) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.SET_IFRAME_URL,
      id,
      url
    });
  };
}

/** VIDEO */
export function addVideo() {
  return (dispatch, getState) => {
    const { editorsReducer } = getState();
    const currentId = editorsReducer.currentWidget;
    const newEditorId = `editor-${editorsReducer.editorIndex}`;
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.ADD_VIDEO
    });
    dispatch({
      type: ActionTypes.ADD_WIDGET,
      currentId,
      newEditorId
    });
  };
}

export function setVideoURL(id, url) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.SET_VIDEO_URL,
      id,
      url
    });
  };
}

/** IMAGE */
export function addImage() {
  return (dispatch, getState) => {
    const { editorsReducer } = getState();
    const currentId = editorsReducer.currentWidget;
    const newEditorId = `editor-${editorsReducer.editorIndex}`;
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.ADD_IMAGE
    });
    dispatch({
      type: ActionTypes.ADD_WIDGET,
      currentId,
      newEditorId
    });
  };
}

export function setImageURL(id, url) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.SET_IMAGE_URL,
      id,
      url
    });
  };
}

export function setImageCrop(id, crop) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.SET_IMAGE_CROP,
      id,
      crop
    });
  };
}

export function resetImageCrop(id) {
  return (dispatch) => {
    dispatch(setUnsavedChanges(true));
    dispatch({
      type: ActionTypes.RESET_IMAGE_CROP,
      id
    });
  };
}

export function loadEditors(editors, editorIndex) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_DB_EDITORS,
      editors,
      editorIndex
    });
  };
}
