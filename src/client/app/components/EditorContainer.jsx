import PropTypes from 'prop-types';
import React from 'react';
import SplitPane from 'react-split-pane';

import P5Editor from './P5Editor.jsx';
import JavascriptEditor from './JavascriptEditor.jsx';
import P5Output from './P5Output.jsx';
import JavascriptOutput from './JavascriptOutput.jsx';
import EditorToolbar from './EditorToolbar.jsx';
import ConsoleOutput from './ConsoleOutput.jsx';
import DragSVG from '../images/drag.svg';
import CloseSVG from '../images/close.svg';


class EditorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResizing: false
    };
    this.startResize = this.startResize.bind(this);
    this.finishResize = this.finishResize.bind(this);
    this.setCurrentEditor = () => this.props.setCurrentEditor(this.props.id);
    this.removeEditor = () => this.props.removeEditor(this.props.id);
    this.playCode = () => this.props.playCode(this.props.id);
    this.stopCode = () => this.props.stopCode(this.props.id);
    this.setInnerWidth = value => this.props.setInnerWidth(this.props.id, value);
    this.setInnerHeight = value => this.props.setInnerHeight(this.props.id, value);
    this.startCodeRefresh = () => this.props.startCodeRefresh(this.props.id);
    this.stopCodeRefresh = () => this.props.stopCodeRefresh(this.props.id);
    this.updateCode = val => this.props.updateCode(this.props.id, val);
    this.updateFile = (index, file) => this.props.updateFile(this.props.id, index, file);
    this.setCurrentFile = index => this.props.setCurrentFile(this.props.id, index);
    this.clearConsoleOutput = () => this.props.clearConsoleOutput(this.props.id);
    this.updateConsoleOutput = (e) => {
      // There's a memory leak in the Javascript editor. Watch the console after clicking Play.
      // console.log(e);
      this.props.updateConsoleOutput(this.props.id, e);
    };
    this.setEditorMode = mode => this.props.setEditorMode(this.props.id, mode);
  }

  startResize() {
    this.setState({ isResizing: true });
  }

  finishResize() {
    this.setState({ isResizing: false });
  }

  render() {
    return (
      <div className="codeEditor_totalContainer" onFocus={this.setCurrentEditor}>
        { this.props.preview ||
          <nav>
            <button
              className="element__close"
              onClick={this.removeEditor}
            >
              <CloseSVG alt="close element" />
            </button>
            <button className={`element__close drag__${this.props.id}`}>
              <DragSVG alt="drag element" />
            </button>
          </nav>
        }
        <EditorToolbar
          currentFile={this.props.currentFile}
          files={this.props.files}
          isPlaying={this.props.isPlaying}
          playCode={this.playCode}
          setCurrentFile={this.setCurrentFile}
          setEditorMode={this.setEditorMode}
          startCodeRefresh={this.startCodeRefresh}
          stopCode={this.stopCode}
        />
        <div className="codeEditor__container">
          <SplitPane
            split="horizontal"
            defaultSize={this.props.innerHeight}
            onDragStarted={this.startResize}
            onDragFinished={(size) => { this.finishResize(); this.setInnerHeight(size); }}
          >
            <div className="codeEditor__sub-container">
              <SplitPane
                split="vertical"
                defaultSize={this.props.innerWidth}
                onDragStarted={this.startResize}
                onDragFinished={(size) => { this.finishResize(); this.setInnerWidth(size); }}
              >
                <div className="codeEditor__input">
                  { this.props.editorMode === 'p5' ? (
                    <P5Editor
                      currentFile={this.props.currentFile}
                      editorCode={this.props.code}
                      files={this.props.files}
                      updateCode={this.updateCode}
                      updateFile={this.updateFile}
                    />
                ) : this.props.editorMode === 'javascript' &&
                  <JavascriptEditor
                    editorCode={this.props.code}
                    updateCode={this.updateCode}
                  />
                }
                </div>
                <div className="codeEditor__output">
                  <div className={`codeEditor__output--overlay ${this.state.isResizing ? 'codeEditor__output--overlay-show' : ''}`}>
                  </div>
                  { this.props.isPlaying && (
                this.props.editorMode === 'p5' ? (
                  <P5Output
                    clearConsoleOutput={this.clearConsoleOutput}
                    editorCode={this.props.code}
                    files={this.props.files}
                    isPlaying={this.props.isPlaying}
                    isRefreshing={this.props.isRefreshing}
                    stopCodeRefresh={this.stopCodeRefresh}
                    updateCode={this.updateCode}
                    updateConsoleOutput={this.updateConsoleOutput}
                  />
                ) : this.props.editorMode === 'javascript' && (
                  <JavascriptOutput
                    editorCode={this.props.code}
                    updateCode={this.updateCode}
                    isPlaying={this.props.isPlaying}
                    updateConsoleOutput={this.updateConsoleOutput}
                    consoleOutputText={this.props.consoleOutputText}
                  />
                )
              )}
                </div>
              </SplitPane>
            </div>
            <div className="codeEditor__console">
              <ConsoleOutput
                consoleOutputText={this.props.consoleOutputText}
              />
            </div>
          </SplitPane>
        </div>
      </div>
    );
  }

}

EditorContainer.propTypes = {
  id: PropTypes.string.isRequired,
  clearConsoleOutput: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
  consoleOutputText: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentFile: PropTypes.number.isRequired,
  editorMode: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })).isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  playCode: PropTypes.func.isRequired,
  preview: PropTypes.bool.isRequired,
  removeEditor: PropTypes.func.isRequired,
  setCurrentEditor: PropTypes.func.isRequired,
  setEditorMode: PropTypes.func.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  startCodeRefresh: PropTypes.func.isRequired,
  stopCode: PropTypes.func.isRequired,
  stopCodeRefresh: PropTypes.func.isRequired,
  updateCode: PropTypes.func.isRequired,
  updateConsoleOutput: PropTypes.func.isRequired,
  updateFile: PropTypes.func.isRequired
};

export default EditorContainer;
