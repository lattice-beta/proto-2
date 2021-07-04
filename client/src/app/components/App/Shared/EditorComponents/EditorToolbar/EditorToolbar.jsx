import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import Tooltip from 'react-tooltip-lite';
import PropTypes from 'prop-types';

import InfoSVG from '../../../../../images/info.svg';
import PauseSVG from '../../../../../images/pause.svg';
import PlaySVG from '../../../../../images/play.svg';
import InteractiveConsoleSVG from '../../../../../images/interactive-console.svg';
import EditorExpand from '../../../../../images/editor-expand.svg';
import EditorCompress from '../../../../../images/editor-compress.svg';
import PreferencesSVG from '../../../../../images/preferences.svg';
import { ProcessingWarning, WorkspaceLanguageConfirmation } from '../../../../../constants/codeConstants.js';
import EditorOptions from '../EditorOptions/EditorOptions.jsx';


require('./editorToolbar.scss');

class EditorToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditorViewOpen: false
    };
  }

  toggleWidgetFullscreen = (e) => {
    if (!this.props.isWidgetFullScreenMode) {
      this.props.setYPosition(window.pageYOffset);
    }
    this.props.toggleWidgetFullscreen(this.props.id);
  }

  toggleEditorView = () => {
    this.setState(prevState => (
      { isEditorViewOpen: !prevState.isEditorViewOpen }));
  }

  renderEditorSizeIcon = () => {
    if (this.props.isWidgetFullScreenMode) {
      return (
        <EditorCompress alt="compress editor" />
      );
    }
    return (<EditorExpand alt="expand editor" />);
  }

  confirmLanguageChange = (e) => {
    const validationResults = window.confirm(WorkspaceLanguageConfirmation);

    if (validationResults === false) {
      e.selectedIndex = (e.selectedIndex === 1) ? 0 : 1;
    } else {
      this.props.setEditorMode(e);
    }
  }

  playCode = () => {
    if (this.props.editorMode === 'python') {
      this.props.disablePythonInteractiveRunMode();
    }
    this.props.playCode();
    if (this.props.isPlaying) {
      this.props.startCodeRefresh();
    }
  }

  enablePythonInteractiveRunMode = () => {
    this.props.stopCode();
    this.props.enablePythonInteractiveRunMode();
  }

  render() {
    return (
      <div className='editor-toolbar__container'>
        <div className='editor-toolbar__button-container'>
          <div className='editor-toolbar__button-container-left'>
            {(this.props.editorMode === 'processing') && (
              <div
                tabIndex='0' // eslint-disable-line
                className='editor-toolbar__svg editor-toolbar__svg-info'
              >
                <InfoSVG alt='More information' />

                <div
                  tabIndex='0' // eslint-disable-line
                  className='editor-toolbar__warning-container'
                >
                  <p className='editor-toolbar__warning'>
                    {ReactHtmlParser(ProcessingWarning)}
                  </p>
                </div>
              </div>
            )}
            {(this.props.editorMode === 'python') && (
              <span
                className='beta-tag'
              >
                beta
              </span>
            )}
            {this.props.container === 'workspace' && (
              <select
                className='editor-toolbar__dropdown'
                onChange={this.confirmLanguageChange}
                value={this.props.editorMode}
              >
                <option value='html'>HTML</option>
                <option value='webdev'>HTML/JS/CSS</option>
                <option value='p5'>p5</option>
                <option value='processing'>Processing</option>
                <option value='python'>Python</option>
              </select>
            )}
            {this.props.container === 'canvas' && (
              <p className='editor-toolbar__title'>
                {this.props.editorMode}
              </p>
            )}
            <Tooltip content="Run Code">
              <button
                className={`editor-toolbar__svg ${this.props.isPlaying ? 'editor-toolbar--isPlaying' : ''}`}
                onClick={this.playCode}
                data-test='play-sketch-button'
              >
                <PlaySVG alt='Run Code' />
              </button>
            </Tooltip>
            <Tooltip content="Stop Code">
              <button
                className={`editor-toolbar__svg ${!this.props.isPlaying ? 'editor-toolbar--isPaused' : ''}`}
                onClick={this.props.stopCode}
                data-test='pause-sketch-button'
              >
                <PauseSVG alt='Pause Code' />
              </button>
            </Tooltip>
            <Tooltip content="Interactive Console">
              <button
                className={`editor-toolbar__svg ${!this.props.isPlaying ? 'editor-toolbar--isPaused' : ''}`}
                onClick={this.enablePythonInteractiveRunMode}
                data-test='pause-sketch-button'
              >
                <InteractiveConsoleSVG alt='Interactive Console' />
              </button>
            </Tooltip>
          </div>
          <div className='editor-toolbar__button-container-right'>
            {this.props.container === 'workspace' && (
              <button
                onClick={this.props.openShareWorkspace}
                className="editor-toolbar__button"
              >
                Share Project
              </button>
            )}
            {this.props.container === 'canvas' && (
              <div
                onClick={(e) => {
                  e.target.focus();
                }}
                role="presentation"
                onBlur={() => {
                  setTimeout(() => {
                    if (this.state.isEditorViewOpen) {
                      this.toggleEditorView();
                    }
                  }, 50);
                }}
              >
                <button
                  onMouseDown={this.toggleEditorView}
                  onKeyDown={this.toggleEditorView}
                  className="editor-toolbar__button"
                >
                  <PreferencesSVG
                    alt='view preferences'
                    className="editor-toolbar__pref-svg"
                  />
                </button>
                <button
                  onMouseDown={this.toggleWidgetFullscreen}
                  onKeyDown={this.toggleWidgetFullscreen}
                  className="editor-toolbar__button"
                >
                  {this.renderEditorSizeIcon()}
                </button>
                {this.state.isEditorViewOpen && (
                  <EditorOptions
                    editorView={this.props.editorView}
                    isConsoleOpen={this.props.isConsoleOpen}
                    isEditorViewOpen={this.state.isEditorViewOpen}
                    setCurrentFile={this.props.setCurrentFile}
                    setEditorView={this.props.setEditorView}
                    toggleConsole={this.props.toggleConsole}
                    toggleEditorView={this.toggleEditorView}
                  />
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }
}

EditorToolbar.propTypes = {
  container: PropTypes.string.isRequired,
  editorMode: PropTypes.string.isRequired,
  editorView: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isConsoleOpen: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isWidgetFullScreenMode: PropTypes.bool.isRequired,
  openShareWorkspace: PropTypes.func.isRequired,
  playCode: PropTypes.func.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  setEditorMode: PropTypes.func.isRequired,
  setEditorView: PropTypes.func.isRequired,
  setYPosition: PropTypes.func.isRequired,
  startCodeRefresh: PropTypes.func.isRequired,
  stopCode: PropTypes.func.isRequired,
  enablePythonInteractiveRunMode: PropTypes.func.isRequired,
  disablePythonInteractiveRunMode: PropTypes.func.isRequired,
  toggleConsole: PropTypes.func.isRequired,
  toggleWidgetFullscreen: PropTypes.func.isRequired,

};

export default EditorToolbar;
