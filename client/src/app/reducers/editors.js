import { EditorState, convertFromRaw } from 'draft-js';
import * as ActionTypes from '../constants/reduxConstants.js';
import * as Code from '../constants/codeConstants.js';
import {
  CODE_DEFAULT_INSIDE_WIDTH,
  QUESION_DEFAULT_INNER_HEIGHT,
  QUESION_MIN_INNER_HEIGHT
} from '../constants/widgetConstants.js';

const initialState = {
  editors: {},
  editorIndex: 0,
  currentWidget: '',
  isDeleteWarningModalOpen: false,
  widgetForDeleteWidgetWarning: '',
  isFullScreenMode: false
};

let stack = [];

// Deep copy
const updateIndices = (editors) => {
  stack.forEach((id, index) => { editors[id].index = index; });
  return editors;
};

const editorsReducer = (state = initialState, action) => {
  if (action.hasOwnProperty('id') && !state.editors.hasOwnProperty(action.id)) {
    return state;
  }

  // deep copy
  const editors = {};
  Object.keys(state.editors).forEach((id) => {
    if (state.editors[id].type === 'text') editors[id] = { ...state.editors[id] };
    else editors[id] = JSON.parse(JSON.stringify(state.editors[id])); // Quicker than spread.
  });

  switch (action.type) {
    /** ALL */
    case ActionTypes.SET_DB_EDITORS: {
      const newEditors = {};
      stack = Object.keys(action.editors); // An array of keys
      stack.forEach((id) => {
        if (action.editors[id].type === 'text') {
          const { rawContentState, ...newEditor } = action.editors[id];
          newEditor.editorState = EditorState.createWithContent(
            convertFromRaw(JSON.parse(rawContentState))
          );
          newEditors[id] = newEditor;
        } else {
          if (action.editors[id].type === 'code') {
            action.editors[id].isWidgetFullScreenMode = false;
            action.editors[id].isPlaying = false;
          }
          newEditors[id] = action.editors[id];
        }
      });
      stack.sort((e1, e2) => newEditors[e1].index - newEditors[e2].index);
      return { editors: newEditors, editorIndex: action.editorIndex };
    }

    case ActionTypes.SET_CURRENT_WIDGET: {
      return { ...state, currentWidget: action.id };
    }

    case ActionTypes.CLOSE_DELETE_WIDGET_WARNING: {
      return { ...state, widgetForDeleteWidgetWarning: action.id, isDeleteWarningModalOpen: false };
    }

    case ActionTypes.OPEN_DELETE_WIDGET_WARNING: {
      return { ...state, widgetForDeleteWidgetWarning: action.id, isDeleteWarningModalOpen: true };
    }

    case ActionTypes.REMOVE_WIDGET:
      stack.splice(stack.indexOf(action.id), 1);
      delete editors[action.id];
      return { ...state, editors: updateIndices(editors) };

    case ActionTypes.TOGGLE_WIDGET_FULLSCREEN: {
      const isWidgetFullScreenMode = state.editors[action.id].isWidgetFullScreenMode;
      editors[action.id].isWidgetFullScreenMode = !isWidgetFullScreenMode;
      if (!editors[action.id].isWidgetFullScreenMode) {
        editors[action.id].innerWidth = CODE_DEFAULT_INSIDE_WIDTH;
      }
      return {
        ...state,
        editors,
        isFullScreenMode: !state.isFullScreenMode
      };
    }

    case ActionTypes.DUPLICATE_WIDGET: {
      const originalEditor = state.editors[action.originalEditorId];
      let newEditor;
      if (originalEditor.type === 'text') {
        newEditor = { ...originalEditor };
      } else {
        newEditor = JSON.parse(JSON.stringify(originalEditor)); // Quicker than spread.
      }
      newEditor.id = action.duplicateWidgetId;
      const editorIndex = state.editorIndex + 1;
      stack.push(newEditor.id);
      editors[newEditor.id] = newEditor;
      return { ...state, editors: updateIndices(editors), editorIndex };
    }

    /** CODE EDITOR */
    case ActionTypes.ADD_CODE_EDITOR: {
      const id = `editor-${state.editorIndex}`;
      editors[id] = {
        type: 'code',
        id,
        index: stack.length,
        consoleOutputText: [],
        currentFile: Code.STARTFILE[action.mode],
        files: Code.FILES[action.mode],
        isPlaying: false,
        isRefreshing: false,
        editorMode: action.mode,
        pythonRunMode: action.mode === 'python' ? 'non-interactive' : '',
        innerWidth: CODE_DEFAULT_INSIDE_WIDTH,
        editorView: 'split',
        isWidgetFullScreenMode: false
      };
      stack.push(id);
      const editorIndex = state.editorIndex + 1;
      const currentWidget = id;
      return { editors, editorIndex, currentWidget };
    }

    case ActionTypes.ADD_FILE_TO_EDITOR: {
      editors[action.id].files.push({
        name: action.name,
        content: action.content,
        isFileInView: true
      });
      return Object.assign({}, state, {
        editors
      });
    }

    case ActionTypes.DELETE_FILE_FROM_EDITOR: {
      editors[action.id].currentFile = action.index - 1;
      editors[action.id].files.splice(action.index, 1);
      return Object.assign({}, state, {
        editors
      });
    }

    case ActionTypes.PLAY_CODE:
      editors[action.id].isPlaying = true;
      return { ...state, editors };

    case ActionTypes.ENABLE_PYTHON_INTERACTIVE_RUN_MODE:
      editors[action.id].pythonRunMode = 'interactive';
      return { ...state, editors };

    case ActionTypes.DISABLE_PYTHON_INTERACTIVE_RUN_MODE:
      editors[action.id].pythonRunMode = 'non-interactive';
      return { ...state, editors };

    case ActionTypes.STOP_CODE:
      editors[action.id].isPlaying = false;
      editors[action.id].consoleOutputText = [];
      return { ...state, editors };

    case ActionTypes.START_CODE_REFRESH:
      editors[action.id].isRefreshing = true;
      return { ...state, editors };

    case ActionTypes.STOP_CODE_REFRESH:
      editors[action.id].isRefreshing = false;
      return { ...state, editors };


    case ActionTypes.UPDATE_CONSOLE_OUTPUT: {
      const tempOutput = editors[action.id].consoleOutputText.slice();
      if (action.event.data.arguments && (action.event.data.id === action.id)) {
        tempOutput.push(action.event.data.arguments.join());
      }
      editors[action.id].consoleOutputText = tempOutput;
      return { ...state, editors };
    }

    case ActionTypes.UPDATE_CONSOLE_OUTPUT_FOR_PYTHON: {
      const tempOutput = editors[action.id].consoleOutputText.slice();
      tempOutput.push(action.output);
      editors[action.id].consoleOutputText = tempOutput;
      return { ...state, editors };
    }

    case ActionTypes.CLEAR_CONSOLE_OUTPUT: {
      editors[action.id].consoleOutputText = [];
      return { ...state, editors };
    }

    case ActionTypes.UPDATE_FILE: {
      editors[action.id].files[action.index].content = action.content;
      return Object.assign({}, state, {
        editors
      });
    }

    case ActionTypes.SET_CURRENT_FILE: {
      editors[action.id].currentFile = action.index;
      return Object.assign({}, state, {
        editors
      });
    }

    case ActionTypes.OPEN_FILE_VIEW: {
      editors[action.id].files[action.index].isFileInView = true;
      return Object.assign({}, state, {
        editors
      });
    }

    case ActionTypes.CLOSE_FILE_VIEW: {
      let isPrevFileDisplayed = false;
      let fileIndexToBeDisplayed = action.index - 1;
      while (!isPrevFileDisplayed && fileIndexToBeDisplayed > -1) {
        if (editors[action.id].files[fileIndexToBeDisplayed].isFileInView) {
          isPrevFileDisplayed = true;
          editors[action.id].currentFile = fileIndexToBeDisplayed;
        } else {
          fileIndexToBeDisplayed -= 1;
        }
      }
      if (fileIndexToBeDisplayed === -1) {
        editors[action.id].currentFile = fileIndexToBeDisplayed;
      }
      editors[action.id].files[action.index].isFileInView = false;
      return Object.assign({}, state, {
        editors
      });
    }

    case ActionTypes.VIEW_EDITOR_PREVIEW: {
      editors[action.id].currentFile = -1;
      return Object.assign({}, state, {
        editors
      });
    }

    case ActionTypes.SET_INNER_WIDTH: {
      editors[action.id].innerWidth = action.value;
      return Object.assign({}, state, {
        editors
      });
    }

    case ActionTypes.ADD_MEDIA_FILE: {
      editors[action.id].files.push({
        name: action.name,
        externalLink: action.link,
        isFileInView: false
      });
      return Object.assign({}, state, {
        editors
      });
    }

    case ActionTypes.SET_EDITOR_VIEW: {
      editors[action.id].editorView = action.value;
      return Object.assign({}, state, {
        editors
      });
    }

    /** TEXT EDITOR */
    case ActionTypes.ADD_TEXT_EDITOR: {
      const id = `editor-${state.editorIndex}`;
      editors[id] = {
        type: 'text',
        id,
        index: stack.length,
        editorState: EditorState.createEmpty(),
        backColor: 'transparent',
      };
      stack.push(id);
      const editorIndex = state.editorIndex + 1;
      const currentWidget = id;
      return { editors, editorIndex, currentWidget };
    }

    case ActionTypes.UPDATE_TEXT_CHANGE:
      editors[action.id].editorState = action.state;
      return { ...state, editors };

    case ActionTypes.UPDATE_TEXT_BACK_COLOR:
      editors[action.id].backColor = action.color;
      return { ...state, editors };


    /** QUESTION EDITOR */
    case ActionTypes.ADD_QUESTION_EDITOR: {
      const id = `editor-${state.editorIndex}`;
      editors[id] = {
        type: 'question',
        id,
        index: stack.length,
        question: 'Enter question here ',
        answer: 'Enter answer here..',
        minHeight: QUESION_MIN_INNER_HEIGHT,
        innerHeight: QUESION_DEFAULT_INNER_HEIGHT,
      };
      stack.push(id);
      const editorIndex = state.editorIndex + 1;
      const currentWidget = id;
      return { editors, editorIndex, currentWidget };
    }

    case ActionTypes.SET_QUESTION_INNER_HEIGHT: {
      editors[action.id].innerHeight = action.value;
      return Object.assign({}, state, {
        editors
      });
    }

    case ActionTypes.UPDATE_QUESTION_CHANGE:
      editors[action.id].question = action.text;
      return { ...state, editors };

    case ActionTypes.UPDATE_ANSWER_CHANGE:
      editors[action.id].answer = action.text;
      return { ...state, editors };

    /** IFRAME */
    case ActionTypes.ADD_IFRAME: {
      const id = `editor-${state.editorIndex}`;
      editors[id] = {
        type: 'iframe',
        id,
        index: stack.length,
        url: 'https://peblio.github.io/instructions/embed.html',
      };
      stack.push(id);
      const editorIndex = state.editorIndex + 1;
      const currentWidget = id;
      return { editors, editorIndex, currentWidget };
    }

    case ActionTypes.SET_IFRAME_URL:
      editors[action.id].url = action.url;
      return { ...state, editors };

    /** VIDEO */
    case ActionTypes.ADD_VIDEO: {
      const id = `editor-${state.editorIndex}`;
      editors[id] = {
        type: 'video',
        id,
        index: stack.length,
        url: 'https://peblio.github.io/instructions/video.html',
      };
      stack.push(id);
      const editorIndex = state.editorIndex + 1;
      const currentWidget = id;
      return { editors, editorIndex, currentWidget };
    }

    case ActionTypes.SET_VIDEO_URL:
      editors[action.id].url = action.url;
      return { ...state, editors };

    /** IMAGE */
    case ActionTypes.ADD_IMAGE: {
      const id = `editor-${state.editorIndex}`;
      editors[id] = {
        type: 'image',
        id,
        index: stack.length,
        url: '',
        crop: {
          x: 0,
          y: 0,
          height: 100,
          width: 100
        },
      };
      stack.push(id);
      const editorIndex = state.editorIndex + 1;
      const currentWidget = id;
      return { editors, editorIndex, currentWidget };
    }

    case ActionTypes.SET_IMAGE_URL:
      editors[action.id].url = action.url;
      return { ...state, editors };

    case ActionTypes.SET_IMAGE_CROP:
      editors[action.id].crop = action.crop;
      return { ...state, editors };

    case ActionTypes.RESET_IMAGE_CROP:
      editors[action.id].crop = {
        x: 0,
        y: 0,
        height: 100,
        width: 100
      };
      return { ...state, editors };

    case ActionTypes.LOGOUT_USER:
      return initialState;

    default:
      return state;
  }
};

export default editorsReducer;
