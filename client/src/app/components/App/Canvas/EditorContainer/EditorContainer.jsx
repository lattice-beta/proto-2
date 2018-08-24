import PropTypes from 'prop-types';
import React from 'react';
import SplitPane from 'react-split-pane';

import CodeEditor from './CodeEditor/CodeEditor.jsx';
import CodeOutput from './CodeOutput/CodeOutput.jsx';
import EditorToolbar from './EditorToolbar/EditorToolbar.jsx';
import ConsoleOutput from './ConsoleOutput/ConsoleOutput.jsx';

require('./editorContainer.scss');

class EditorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResizing: false
    };
    this.startResize = this.startResize.bind(this);
    this.finishResize = this.finishResize.bind(this);
    this.removeEditor = () => this.props.removeEditor(this.props.id);
    this.playCode = () => this.props.playCode(this.props.id);
    this.stopCode = () => this.props.stopCode(this.props.id);
    this.setInnerWidth = value => this.props.setInnerWidth(this.props.id, value);
    this.setInnerHeight = value => this.props.setInnerHeight(this.props.id, value);
    this.startCodeRefresh = () => this.props.startCodeRefresh(this.props.id);
    this.stopCodeRefresh = () => this.props.stopCodeRefresh(this.props.id);
    this.updateFile = (index, file) => this.props.updateFile(this.props.id, index, file);
    this.setCurrentFile = index => this.props.setCurrentFile(this.props.id, index);
    this.clearConsoleOutput = () => this.props.clearConsoleOutput(this.props.id);
    this.updateConsoleOutput = (e) => {
      // There's a memory leak in the Javascript editor. Watch the console after clicking Play.
      this.props.updateConsoleOutput(this.props.id, e);
    };
  }

  startResize() {
    this.setState({ isResizing: true });
  }

  finishResize() {
    this.setState({ isResizing: false });
  }

  render() {
    return (
      <div>
        <div className="editor__total-container" data-test={`code-editor-${this.props.editorMode}`}>
          <EditorToolbar
            currentFile={this.props.currentFile}
            editorMode={this.props.editorMode}
            files={this.props.files}
            isPlaying={this.props.isPlaying}
            playCode={this.playCode}
            setCurrentFile={this.setCurrentFile}
            startCodeRefresh={this.startCodeRefresh}
            stopCode={this.stopCode}
          />
          <div className="editor__container">


            <SplitPane
              split="horizontal"
              defaultSize={this.props.innerHeight}
              onDragStarted={this.startResize}
              onDragFinished={(size) => { this.finishResize(); this.setInnerHeight(size); }}
            >
              <div className="editor__sub-container">
                <SplitPane
                  split="vertical"
                  defaultSize={this.props.innerWidth}
                  onDragStarted={this.startResize}
                  onDragFinished={(size) => { this.finishResize(); this.setInnerWidth(size); }}
                >
                  <div className="editor__input">

                    <CodeEditor
                      currentFile={this.props.currentFile}
                      files={this.props.files}
                      updateFile={this.updateFile}
                      editorFontSize={this.props.editorFontSize}
                      editorTheme={this.props.editorTheme}
                    />

                  </div>
                  <div className="editor__output">
                    <div
                      className={`editor__output-overlay
                      ${this.state.isResizing
        ? 'editor__output-overlay--show' : ''}`}
                    >
                    </div>
                    { this.props.isPlaying && (
                      <CodeOutput
                        id={this.props.id}
                        clearConsoleOutput={this.clearConsoleOutput}
                        files={this.props.files}
                        isPlaying={this.props.isPlaying}
                        isRefreshing={this.props.isRefreshing}
                        stopCodeRefresh={this.stopCodeRefresh}
                        updateConsoleOutput={this.updateConsoleOutput}
                      />
                    )}
                  </div>
                </SplitPane>
              </div>
              <div className="editor__console">
                <ConsoleOutput
                  consoleOutputText={this.props.consoleOutputText}
                />
              </div>
            </SplitPane>

          </div>
        </div>

      </div>
    );
  }
}

EditorContainer.propTypes = {
  id: PropTypes.string.isRequired,
  clearConsoleOutput: PropTypes.func.isRequired,
  consoleOutputText: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentFile: PropTypes.number.isRequired,
  editorFontSize: PropTypes.number.isRequired,
  editorMode: PropTypes.string.isRequired,
  editorTheme: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })).isRequired,
  innerHeight: PropTypes.number.isRequired,
  innerWidth: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  playCode: PropTypes.func.isRequired,
  removeEditor: PropTypes.func.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  setInnerHeight: PropTypes.func.isRequired,
  setInnerWidth: PropTypes.func.isRequired,
  startCodeRefresh: PropTypes.func.isRequired,
  stopCode: PropTypes.func.isRequired,
  stopCodeRefresh: PropTypes.func.isRequired,
  updateConsoleOutput: PropTypes.func.isRequired,
  updateFile: PropTypes.func.isRequired
};

export default EditorContainer;
