import PropTypes from 'prop-types';
import React from 'react';

import CodeEditor from '../CodeEditor/CodeEditor.jsx';
import CodeOutput from '../CodeOutput/CodeOutput.jsx';
import ConsoleOutput from '../ConsoleOutput/ConsoleOutput.jsx';
import EditorOpenFiles from '../EditorOpenFiles/EditorOpenFiles.jsx';

class TabbedContainer extends React.Component {
  render() {
    return (
      <div className="editor__container">
        <EditorOpenFiles
          id={this.props.id}
          closeFileView={this.props.closeFileView}
          container="tabbed-editor"
          currentFile={this.props.currentFile}
          files={this.props.files}
          openFileView={this.props.openFileView}
          setCurrentFile={this.props.setCurrentFile}
          toggleEditorFilesView={this.props.toggleEditorFilesView}
          viewEditorPreview={this.props.viewEditorPreview}
        />
        {this.props.currentFile === -1 || (
          <div className="editor__input editor__input-tabbed">
            <CodeEditor
              id={this.props.id}
              closeFileView={this.props.closeFileView}
              currentFile={this.props.currentFile}
              files={this.props.files}
              isEditorFilesOpen={this.props.isEditorFilesOpen}
              setCurrentFile={this.props.setCurrentFile}
              toggleEditorFilesView={this.props.toggleEditorFilesView}
              updateFile={this.props.updateFile}
            />
          </div>
        )}
        {this.props.currentFile === -1 && (
          <div className={`editor__output ${this.props.isConsoleOpen ? 'editor__output--short' : ''}`}>
            <div
              className={`editor__output-overlay
                      ${this.props.isResizing
            ? 'editor__output-overlay--show' : ''}`}
            >
            </div>
            { this.props.isPlaying && (
              <CodeOutput
                id={this.props.id}
                clearConsoleOutput={this.props.clearConsoleOutput}
                editorMode={this.props.editorMode}
                pythonRunMode={this.props.pythonRunMode}
                files={this.props.files}
                isPlaying={this.props.isPlaying}
                isRefreshing={this.props.isRefreshing}
                stopCodeRefresh={this.props.stopCodeRefresh}
                updateConsoleOutput={this.props.updateConsoleOutput}
                consoleOutputText={this.props.consoleOutputText}
                updateConsoleOutputForPython={this.props.updateConsoleOutputForPython}
              />
            )}
            <ConsoleOutput
              consoleOutputText={this.props.consoleOutputText}
              isConsoleOpen={this.props.isConsoleOpen}
              toggleConsole={this.props.toggleConsole}
            />
          </div>
        )}

      </div>
    );
  }
}

TabbedContainer.propTypes = {
  id: PropTypes.string.isRequired,
  clearConsoleOutput: PropTypes.func.isRequired,
  closeFileView: PropTypes.func.isRequired,
  consoleOutputText: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentFile: PropTypes.number.isRequired,
  editorMode: PropTypes.string.isRequired,
  pythonRunMode: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })).isRequired,
  isConsoleOpen: PropTypes.bool.isRequired,
  isEditorFilesOpen: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  isResizing: PropTypes.bool.isRequired,
  openFileView: PropTypes.func.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  stopCodeRefresh: PropTypes.func.isRequired,
  toggleConsole: PropTypes.func.isRequired,
  updateConsoleOutput: PropTypes.func.isRequired,
  updateConsoleOutputForPython: PropTypes.func.isRequired,
  toggleEditorFilesView: PropTypes.func.isRequired,
  updateFile: PropTypes.func.isRequired,
  viewEditorPreview: PropTypes.func.isRequired
};


export default TabbedContainer;
