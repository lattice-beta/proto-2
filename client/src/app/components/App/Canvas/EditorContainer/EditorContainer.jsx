import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EditorToolbar from '../../Shared/EditorComponents/EditorToolbar/EditorToolbar.jsx';
import EditorFiles from '../../Shared/EditorComponents/EditorFiles/EditorFiles.jsx';
import * as editorActions from '../../../../action/editors.js';
import { setYPosition } from '../../../../action/navigation.js';
import SplitEditorContainer from '../../Shared/EditorComponents/EditorViews/SplitEditorContainer.jsx';
import TabbedEditorContainer from '../../Shared/EditorComponents/EditorViews/TabbedEditorContainer.jsx';
import { loadMemoryConsumed } from '../../../../action/dashboard.js';

require('./editorContainer.scss');
require('./resizer.scss');

class EditorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResizing: false,
      isConsoleOpen: true,
      isEditorFilesOpen: false
    };
    this.startResize = this.startResize.bind(this);
    this.finishResize = this.finishResize.bind(this);
    this.addMediaFile = (name, link) => this.props.addMediaFile(this.props.id, name, link);
    this.addFileToEditor = (name, content) => this.props.addFileToEditor(this.props.id, name, content);
    this.deleteFileFromEditor = index => this.props.deleteFileFromEditor(this.props.id, index);
    this.playCode = () => this.props.playCode(this.props.id);
    this.enablePythonInteractiveRunMode = () => this.props.enablePythonInteractiveRunMode(this.props.id);
    this.disablePythonInteractiveRunMode = () => this.props.disablePythonInteractiveRunMode(this.props.id);
    this.stopCode = () => this.props.stopCode(this.props.id);
    this.setEditorView = value => this.props.setEditorView(this.props.id, value);
    this.setInnerWidth = value => this.props.setInnerWidth(this.props.id, value);
    this.startCodeRefresh = () => this.props.startCodeRefresh(this.props.id);
    this.stopCodeRefresh = () => this.props.stopCodeRefresh(this.props.id);
    this.updateFile = (index, file) => this.props.updateFile(this.props.id, index, file);
    this.setCurrentFile = index => this.props.setCurrentFile(this.props.id, index);
    this.closeFileView = index => this.props.closeFileView(this.props.id, index);
    this.openFileView = index => this.props.openFileView(this.props.id, index);
    this.clearConsoleOutput = () => this.props.clearConsoleOutput(this.props.id);
    this.updateConsoleOutput = (e) => {
      // UPDATE: 29-Oct-18 : Not using Javascript editor now, but keep in mind if added
      // Dec-17 : There's a memory leak in the Javascript editor. Watch the console after clicking Play.
      this.props.updateConsoleOutput(this.props.id, e);
    };
    this.updateConsoleOutputForPython = (e) => {
      this.props.updateConsoleOutputForPython(this.props.id, e);
    };
    this.viewEditorPreview = () => this.props.viewEditorPreview(this.props.id);
  }

  onKeyPressed(e) {
    if (e.metaKey || e.ctrlKey) {
      switch (e.keyCode) {
        case 69: // e,E
          // play code
          this.playCode();
          if (this.props.isPlaying) { this.startCodeRefresh(); }
          e.preventDefault();
          break;
        default:
          break;
      }
    }
  }

  toggleConsole = () => {
    this.setState(prevState => ({ isConsoleOpen: !prevState.isConsoleOpen }));
  }

  toggleEditorFilesView = () => {
    this.setState(prevState => ({ isEditorFilesOpen: !prevState.isEditorFilesOpen }));
  }

  editorView = () => this.props.editorView || 'split'

  startResize() {
    this.setState({ isResizing: true });
  }

  finishResize() {
    this.setState({ isResizing: false });
  }

  render() {
    const themeClass = classNames('editor__total-container', {
      editor__dark: (this.props.editorTheme === 'dark'),
      editor__light: (this.props.editorTheme === 'light'),
    });
    return (
      <div>
        <div
          className={classNames(themeClass)}
          data-test={`code-editor-${this.props.editorMode}`}
          onKeyDown={e => this.onKeyPressed(e)}
          role="navigation"
        >
          <EditorToolbar
            id={this.props.id}
            container="canvas"
            deleteFileFromEditor={this.deleteFileFromEditor}
            editorMode={this.props.editorMode}
            editorView={this.props.editorView}
            isConsoleOpen={this.state.isConsoleOpen}
            isPlaying={this.props.isPlaying}
            isWidgetFullScreenMode={this.props.isWidgetFullScreenMode}
            playCode={this.playCode}
            enablePythonInteractiveRunMode={this.enablePythonInteractiveRunMode}
            disablePythonInteractiveRunMode={this.disablePythonInteractiveRunMode}
            setCurrentFile={this.setCurrentFile}
            setEditorView={this.setEditorView}
            setYPosition={this.props.setYPosition}
            startCodeRefresh={this.startCodeRefresh}
            stopCode={this.stopCode}
            toggleConsole={this.toggleConsole}
            toggleWidgetFullscreen={this.props.toggleWidgetFullscreen}
          />
          <div className='editor__vertical-container'>
            {this.state.isEditorFilesOpen && (
              <EditorFiles
                id={this.props.id}
                addMediaFile={this.addMediaFile}
                addFileToEditor={this.addFileToEditor}
                currentFile={this.props.currentFile}
                deleteFileFromEditor={this.deleteFileFromEditor}
                editorMode={this.props.editorMode}
                editorView={this.props.editorView}
                files={this.props.files}
                name={this.props.name}
                openFileView={this.openFileView}
                setCurrentFile={this.setCurrentFile}
                viewEditorPreview={this.viewEditorPreview}
                loadMemoryConsumed={this.props.loadMemoryConsumed}
                memoryConsumed={this.props.memoryConsumed}
                totalMemory={this.props.totalMemory}
              />
            )}
            {this.editorView() === 'split' && (
              <SplitEditorContainer
                id={this.props.id}
                clearConsoleOutput={this.clearConsoleOutput}
                closeFileView={this.closeFileView}
                consoleOutputText={this.props.consoleOutputText}
                currentFile={this.props.currentFile}
                editorMode={this.props.editorMode}
                files={this.props.files}
                finishResize={this.finishResize}
                innerWidth={this.props.innerWidth}
                isConsoleOpen={this.state.isConsoleOpen}
                isEditorFilesOpen={this.state.isEditorFilesOpen}
                isResizing={this.state.isResizing}
                isPlaying={this.props.isPlaying}
                pythonRunMode={this.props.pythonRunMode}
                isRefreshing={this.props.isRefreshing}
                openFileView={this.openFileView}
                setCurrentFile={this.setCurrentFile}
                setInnerWidth={this.setInnerWidth}
                startResize={this.startResize}
                stopCodeRefresh={this.stopCodeRefresh}
                toggleConsole={this.toggleConsole}
                toggleEditorFilesView={this.toggleEditorFilesView}
                updateConsoleOutput={this.updateConsoleOutput}
                updateConsoleOutputForPython={this.updateConsoleOutputForPython}
                updateFile={this.updateFile}
                viewEditorPreview={this.viewEditorPreview}
              />
            )}
            {this.editorView() === 'tabbed' && (
              <TabbedEditorContainer
                id={this.props.id}
                clearConsoleOutput={this.clearConsoleOutput}
                closeFileView={this.closeFileView}
                consoleOutputText={this.props.consoleOutputText}
                currentFile={this.props.currentFile}
                editorMode={this.props.editorMode}
                files={this.props.files}
                finishResize={this.finishResize}
                isConsoleOpen={this.state.isConsoleOpen}
                isEditorFilesOpen={this.state.isEditorFilesOpen}
                pythonRunMode={this.props.pythonRunMode}
                isPlaying={this.props.isPlaying}
                isResizing={this.state.isResizing}
                isRefreshing={this.props.isRefreshing}
                innerWidth={this.props.innerWidth}
                openFileView={this.openFileView}
                startResize={this.startResize}
                setCurrentFile={this.setCurrentFile}
                setInnerWidth={this.setInnerWidth}
                stopCodeRefresh={this.stopCodeRefresh}
                toggleConsole={this.toggleConsole}
                toggleEditorFilesView={this.toggleEditorFilesView}
                updateFile={this.updateFile}
                updateConsoleOutput={this.updateConsoleOutput}
                updateConsoleOutputForPython={this.updateConsoleOutputForPython}
                viewEditorPreview={this.viewEditorPreview}
              />
            )}
          </div>
        </div>

      </div>
    );
  }
}

EditorContainer.propTypes = {
  id: PropTypes.string.isRequired,
  addMediaFile: PropTypes.func.isRequired,
  addFileToEditor: PropTypes.func.isRequired,
  clearConsoleOutput: PropTypes.func.isRequired,
  closeFileView: PropTypes.func.isRequired,
  consoleOutputText: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentFile: PropTypes.number.isRequired,
  deleteFileFromEditor: PropTypes.func.isRequired,
  editorMode: PropTypes.string.isRequired,
  pythonRunMode: PropTypes.string.isRequired,
  editorTheme: PropTypes.string.isRequired,
  editorView: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })).isRequired,
  innerWidth: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  isWidgetFullScreenMode: PropTypes.bool.isRequired,
  openFileView: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  playCode: PropTypes.func.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  setEditorView: PropTypes.func.isRequired,
  setInnerWidth: PropTypes.func.isRequired,
  setYPosition: PropTypes.func.isRequired,
  startCodeRefresh: PropTypes.func.isRequired,
  stopCode: PropTypes.func.isRequired,
  stopCodeRefresh: PropTypes.func.isRequired,
  toggleWidgetFullscreen: PropTypes.func.isRequired,
  updateConsoleOutput: PropTypes.func.isRequired,
  updateConsoleOutputForPython: PropTypes.func.isRequired,
  updateFile: PropTypes.func.isRequired,
  viewEditorPreview: PropTypes.func.isRequired,
  loadMemoryConsumed: PropTypes.func.isRequired,
  memoryConsumed: PropTypes.number.isRequired,
  totalMemory: PropTypes.number.isRequired,
  enablePythonInteractiveRunMode: PropTypes.func.isRequired,
  disablePythonInteractiveRunMode: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    name: state.user.name,
    editorTheme: state.preferences.editorTheme,
    memoryConsumed: state.dashboard.memoryConsumed,
    totalMemory: state.dashboard.totalMemory,
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({
  ...editorActions,
  setYPosition,
  loadMemoryConsumed,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer);
