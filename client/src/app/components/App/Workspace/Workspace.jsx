import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import SplitPane from 'react-split-pane';

import * as workspaceAction from '../../../action/workspace.js';
import { loadMemoryConsumed } from '../../../action/dashboard.js';
import { submitPage } from '../../../action/page.js';
import CodeEditor from '../Shared/EditorComponents/CodeEditor/CodeEditor.jsx';
import CodeOutput from '../Shared/EditorComponents/CodeOutput/CodeOutput.jsx';
import EditorToolbar from '../Shared/EditorComponents/EditorToolbar/EditorToolbar.jsx';
import EditorOpenFiles from '../Shared/EditorComponents/EditorOpenFiles/EditorOpenFiles.jsx';
import EditorFiles from '../Shared/EditorComponents/EditorFiles/EditorFiles.jsx';
import ConsoleOutput from '../Shared/EditorComponents/ConsoleOutput/ConsoleOutput.jsx';
import ShareWorkspace from '../Modal/ShareWorkspace/ShareWorkspace.jsx';
import Modal from '../Modal/Modal.jsx';

require('./workspace.scss');

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResizing: false,
      isConsoleOpen: true,
      isEditorFilesOpen: false
    };
  }

  updateConsoleOutput = (e) => {
    // UPDATE: 29-Oct-18 : Not using Javascript editor now, but keep in mind if added
    // Dec-17 : There's a memory leak in the Javascript editor. Watch the console after clicking Play.
    this.props.updateConsoleOutput('workspace', e);
  };

  toggleConsole = () => {
    this.setState(prevState => ({ isConsoleOpen: !prevState.isConsoleOpen }));
  }

  toggleEditorFilesView = () => {
    this.setState(prevState => ({ isEditorFilesOpen: !prevState.isEditorFilesOpen }));
  }

  startResize= () => {
    this.setState({ isResizing: true });
  }

  finishResize = () => {
    this.setState({ isResizing: false });
  }

  toggleWorkspace =(e) => {
    e.stopPropagation();
    this.props.toggleWorkspace();
  }

  render() {
    const themeClass = classNames('workspace__total-container', {
      'editor__dark': (this.props.editorTheme === 'dark'),
      'editor__light': (this.props.editorTheme === 'light'),
      'workspace__total-container--open': (this.props.isWorkspaceOpen === true)
    });
    return (
      <section>
        <div>
          <div className={classNames(themeClass)}>
            <div //eslint-disable-line
              className='workspace__header-container'
              data-test='workspace__header-container'
              tabIndex='0' //eslint-disable-line
              onClick={e => this.toggleWorkspace(e)}
            >
              <h1 className='workspace__header'>
                My Workspace
              </h1>
              <button
                className="workspace__toggle"
                onClick={e => this.toggleWorkspace(e)}
              >
                {this.props.isWorkspaceOpen &&
                <i className="fas fa-caret-down"></i>
                }
                {this.props.isWorkspaceOpen ||
                <i className="fas fa-caret-up"></i>
                }
              </button>
            </div>
            {this.props.isWorkspaceOpen && (
              <div>
                <EditorToolbar
                  deleteFileFromEditor={this.props.deleteFileFromEditor}
                  currentFile={this.props.currentFile}
                  editorMode={this.props.editorMode}
                  files={this.props.files}
                  isPlaying={this.props.isPlaying}
                  name={this.props.name}
                  playCode={this.props.playCode}
                  setCurrentFile={this.props.setCurrentFile}
                  startCodeRefresh={this.props.startCodeRefresh}
                  stopCode={this.props.stopCode}
                  container='workspace'
                  setEditorMode={this.props.setEditorMode}
                  openShareWorkspace={this.props.openShareWorkspace}
                />
                <div className='workspace__container'>
                  {this.state.isEditorFilesOpen && (
                    <EditorFiles
                      addMediaFile={this.props.addMediaFile}
                      addFileToEditor={this.props.addFileToEditor}
                      deleteFileFromEditor={this.props.deleteFileFromEditor}
                      currentFile={this.props.currentFile}
                      editorMode={this.props.editorMode}
                      files={this.props.files}
                      name={this.props.name}
                      openFileView={this.props.openFileView}
                      setCurrentFile={this.props.setCurrentFile}
                      loadMemoryConsumed={this.props.loadMemoryConsumed}
                      memoryConsumed={this.props.memoryConsumed}
                      totalMemory={this.props.totalMemory}
                    />
                  )}

                  <div className='workspace__sub-container'>

                    <SplitPane
                      split='vertical'
                      defaultSize={this.props.innerWidth}
                      onDragStarted={this.startResize}
                      onDragFinished={(size) => { this.finishResize(); this.props.setInnerWidth(size); }}
                    >
                      <div className='workspace__input'>
                        <EditorOpenFiles
                          closeFileView={this.props.closeFileView}
                          container="split-editor"
                          currentFile={this.props.currentFile}
                          files={this.props.files}
                          openFileView={this.props.openFileView}
                          setCurrentFile={this.props.setCurrentFile}
                          toggleEditorFilesView={this.toggleEditorFilesView}
                        />

                        <CodeEditor
                          currentFile={this.props.currentFile}
                          files={this.props.files}
                          updateFile={this.props.updateFile}
                          editorFontSize={this.props.editorFontSize}
                          editorTheme={this.props.editorTheme}
                          container='workspace'
                        />
                      </div>
                      <div
                        className={`workspace__output ${this.state.isConsoleOpen ? 'workspace__output--short' : ''}`}
                      >
                        <div
                          className={`workspace__output-overlay
                          ${this.state.isResizing
                ? 'workspace__output-overlay--show' : ''}`}
                        >
                        </div>
                        { this.props.isPlaying && (
                          <CodeOutput
                            id='workspace'
                            clearConsoleOutput={this.props.clearConsoleOutput}
                            editorMode={this.props.editorMode}
                            pythonRunMode={this.props.pythonRunMode}
                            files={this.props.files}
                            isPlaying={this.props.isPlaying}
                            isRefreshing={this.props.isRefreshing}
                            stopCodeRefresh={this.props.stopCodeRefresh}
                            updateConsoleOutput={this.updateConsoleOutput}
                            consoleOutputText={this.props.consoleOutputText}
                          />
                        )}
                        <ConsoleOutput
                          consoleOutputText={this.props.consoleOutputText}
                          isConsoleOpen={this.state.isConsoleOpen}
                          toggleConsole={this.toggleConsole}
                        />
                      </div>
                    </SplitPane>
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>
        <Modal
          size="auto"
          isOpen={this.props.isShareWorkspaceOpen}
          closeModal={this.props.closeShareWorkspace}
        >
          <ShareWorkspace
            closeModal={this.props.closeShareWorkspace}
            workspace={this.props.workspace}
            submitPage={this.props.submitPage}
          />
        </Modal>
      </section>
    );
  }
}

Workspace.propTypes = {
  addMediaFile: PropTypes.func.isRequired,
  addFileToEditor: PropTypes.func.isRequired,
  clearConsoleOutput: PropTypes.func.isRequired,
  closeShareWorkspace: PropTypes.func.isRequired,
  closeFileView: PropTypes.func.isRequired,
  consoleOutputText: PropTypes.string.isRequired,
  currentFile: PropTypes.number.isRequired,
  deleteFileFromEditor: PropTypes.func.isRequired,
  editorFontSize: PropTypes.number.isRequired,
  editorMode: PropTypes.string.isRequired,
  pythonRunMode: PropTypes.string.isRequired,
  editorTheme: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })).isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  innerWidth: PropTypes.number.isRequired,
  isShareWorkspaceOpen: PropTypes.bool.isRequired,
  isWorkspaceOpen: PropTypes.bool.isRequired,
  loadMemoryConsumed: PropTypes.func.isRequired,
  openFileView: PropTypes.func.isRequired,
  openShareWorkspace: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  playCode: PropTypes.func.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  setEditorMode: PropTypes.func.isRequired,
  setInnerWidth: PropTypes.func.isRequired,
  startCodeRefresh: PropTypes.func.isRequired,
  stopCode: PropTypes.func.isRequired,
  stopCodeRefresh: PropTypes.func.isRequired,
  submitPage: PropTypes.func.isRequired,
  toggleWorkspace: PropTypes.func.isRequired,
  updateConsoleOutput: PropTypes.func.isRequired,
  updateFile: PropTypes.func.isRequired,
  workspace: PropTypes.shape({}).isRequired,
  memoryConsumed: PropTypes.number.isRequired,
  totalMemory: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  consoleOutputText: state.workspace.workspace.consoleOutputText,
  currentFile: state.workspace.workspace.currentFile,
  editorFontSize: state.preferences.editorFontSize,
  editorMode: state.workspace.workspace.editorMode,
  pythonRunMode: state.workspace.workspace.pythonRunMode,
  editorTheme: state.preferences.editorTheme,
  files: state.workspace.workspace.files,
  innerWidth: state.workspace.workspace.innerWidth,
  isPlaying: state.workspace.workspace.isPlaying,
  isRefreshing: state.workspace.workspace.isRefreshing,
  isShareWorkspaceOpen: state.workspace.isShareWorkspaceOpen,
  isWorkspaceOpen: state.workspace.isWorkspaceOpen,
  memoryConsumed: state.dashboard.memoryConsumed,
  name: state.user.name,
  workspace: state.workspace.workspace,
  totalMemory: state.dashboard.totalMemory,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...workspaceAction,
  submitPage,
  loadMemoryConsumed
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
