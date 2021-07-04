import React from 'react';
import PropTypes from 'prop-types';
import srcDoc from 'srcdoc-polyfill'; // eslint-disable-line
import FrontEndOutput from './FrontEndOutput.jsx';
import ProcessingOutput from './ProcessingOutput.jsx';
import PythonRepl from '../PythonRepl/PythonRepl';
import PythonOutput from './PythonOutput';

const NOT_EXTERNAL_LINK_REGEX = /^(?!(http:\/\/|https:\/\/))/; // eslint-disable-line

class CodeOutput extends React.Component {
  render() {
    return (
      <div>
        {
          ['p5', 'html', 'webdev'].includes(this.props.editorMode) && (
            <FrontEndOutput
              id={this.props.id}
              clearConsoleOutput={this.props.clearConsoleOutput}
              files={this.props.files}
              isPlaying={this.props.isPlaying}
              isRefreshing={this.props.isRefreshing}
              stopCodeRefresh={this.props.stopCodeRefresh}
              updateConsoleOutput={this.props.updateConsoleOutput}
              consoleOutputText={this.props.consoleOutputText}
            />
          )}
        {
          ['processing'].includes(this.props.editorMode) && (
            <ProcessingOutput
              id={this.props.id}
              clearConsoleOutput={this.props.clearConsoleOutput}
              files={this.props.files}
              isPlaying={this.props.isPlaying}
              isRefreshing={this.props.isRefreshing}
              stopCodeRefresh={this.props.stopCodeRefresh}
              updateConsoleOutput={this.props.updateConsoleOutput}
            />
          )
        }
        {
          ['python'].includes(this.props.editorMode) && this.props.pythonRunMode !== 'interactive' && (
            <PythonOutput
              id={this.props.id}
              clearConsoleOutput={this.props.clearConsoleOutput}
              files={this.props.files}
              isPlaying={this.props.isPlaying}
              isRefreshing={this.props.isRefreshing}
              stopCodeRefresh={this.props.stopCodeRefresh}
              updateConsoleOutput={this.props.updateConsoleOutputForPython}
            />
          )
        }
        {
          ['python'].includes(this.props.editorMode) && this.props.pythonRunMode === 'interactive' && (
            <PythonRepl />
          )
        }
      </div>
    );
  }
}

CodeOutput.propTypes = {
  id: PropTypes.string.isRequired,
  clearConsoleOutput: PropTypes.func.isRequired,
  consoleOutputText: PropTypes.string.isRequired,
  editorMode: PropTypes.string.isRequired,
  pythonRunMode: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })).isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  stopCodeRefresh: PropTypes.func.isRequired,
  updateConsoleOutput: PropTypes.func.isRequired,
  updateConsoleOutputForPython: PropTypes.func.isRequired
};

export default CodeOutput;
