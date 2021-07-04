import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EditorSVG from '../../../../images/editor.svg';
import EmbedSVG from '../../../../images/embed.svg';
import ImageSVG from '../../../../images/image.svg';
import QuestionSVG from '../../../../images/question.svg';
import TextSVG from '../../../../images/text.svg';
import VideoSVG from '../../../../images/video.svg';
import HistorySVG from '../../../../images/history.svg';
import {
  addCodeEditor,
  addIframe,
  addImage,
  addTextEditor,
  addQuestionEditor,
  addVideo
} from '../../../../action/editors.js';
import { togglePageVersion } from '../../../../action/pageVersion.js';

require('./insertToolbar.scss');

export class InsertToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorExpanded: false
    };
    this.toggleEditorOptions = this.toggleEditorOptions.bind(this);
  }

  toggleEditorOptions() {
    this.setState(prevState => ({
      editorExpanded: !prevState.editorExpanded
    }));
  }

  render() {
    return (
      <div className="insert-toolbar__container insert-toolbar__expand">
        <div
          className="insert-toolbar__container-left"
          data-test="insert-toolbar__container"
        >
          <button
            className="insert-toolbar__button "
            onMouseDown={this.toggleEditorOptions}
            onKeyDown={this.toggleEditorOptions}
            onBlur={() => {
              setTimeout(() => {
                if (this.state.editorExpanded) {
                  this.toggleEditorOptions();
                }
              }, 50);
            }}
            data-test="add-code-editor"
            id="insert-toolbar__add-code-editor"
          >
            <EditorSVG alt="add code editor" />
            Editor
          </button>
          {this.state.editorExpanded && (
            <div className="insert-toolbar__sub-menu">
              <ul className="insert-toolbar__list">
                <li className="insert-toolbar__list-item">
                  <button
                    className="insert-toolbar__list-button"
                    onMouseDown={() => {
                      this.toggleEditorOptions();
                      this.props.addCodeEditor('html');
                    }}
                    onKeyDown={() => {
                      this.toggleEditorOptions();
                      this.props.addCodeEditor('html');
                    }}
                    data-test="add-html-editor"
                  >
                    HTML
                  </button>
                </li>
                <li className="insert-toolbar__list-item">
                  <button
                    className="insert-toolbar__list-button"
                    onMouseDown={() => {
                      this.toggleEditorOptions();
                      this.props.addCodeEditor('webdev');
                    }}
                    onKeyDown={() => {
                      this.toggleEditorOptions();
                      this.props.addCodeEditor('webdev');
                    }}
                    data-test="add-webdev-editor"
                  >
                    HTML/JS/CSS
                  </button>
                </li>
                <li className="insert-toolbar__list-item">
                  <button
                    className="insert-toolbar__list-button"
                    onMouseDown={() => {
                      this.toggleEditorOptions();
                      this.props.addCodeEditor('p5');
                    }}
                    onKeyDown={() => {
                      this.toggleEditorOptions();
                      this.props.addCodeEditor('p5');
                    }}
                    data-test="add-p5-editor"
                  >
                    P5
                  </button>
                </li>
                <li className="insert-toolbar__list-item">
                  <button
                    className="insert-toolbar__list-button"
                    onMouseDown={() => {
                      this.toggleEditorOptions();
                      this.props.addCodeEditor('processing');
                    }}
                    onKeyDown={() => {
                      this.toggleEditorOptions();
                      this.props.addCodeEditor('processing');
                    }}
                    data-test="add-processing-editor"
                  >
                    Processing
                  </button>
                </li>
                <li className="insert-toolbar__list-item">
                  <button
                    className="insert-toolbar__list-button"
                    onMouseDown={() => {
                      this.toggleEditorOptions();
                      this.props.addCodeEditor('python');
                    }}
                    onKeyDown={() => {
                      this.toggleEditorOptions();
                      this.props.addCodeEditor('python');
                    }}
                    data-test="add-python-editor"
                  >
                    Python
                    <span
                      className="beta-tag"
                    >
                      beta
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          )}
          <button
            onMouseDown={this.props.addTextEditor}
            onKeyDown={this.props.addTextEditor}
            id="elementButton"
            className="insert-toolbar__button"
            data-test="insert-toolbar__add-text-editor"
            id="insert-toolbar__add-text-editor"
          >
            <TextSVG alt="add text" />
            Textbox
          </button>
          <button
            onMouseDown={this.props.addIframe}
            onKeyDown={this.props.addIframe}
            className="insert-toolbar__button"
            data-test="insert-toolbar__add-iframe"
            id="insert-toolbar__add-iframe"
          >
            <EmbedSVG alt="add embed" />
            Embed
          </button>
          <button
            onMouseDown={this.props.addVideo}
            onKeyDown={this.props.addVideo}
            className="insert-toolbar__button"
            data-test="insert-toolbar__add-video"
            id="insert-toolbar__add-video"
          >
            <VideoSVG alt="add video" />
            Video
          </button>
          <button
            onMouseDown={this.props.addQuestionEditor}
            onKeyDown={this.props.addQuestionEditor}
            id="elementButton"
            className="insert-toolbar__button"
            data-test="insert-toolbar__add-question"
            id="insert-toolbar__add-question"
          >
            <QuestionSVG alt="add question" />
            Question
          </button>
          <button
            onMouseDown={this.props.addImage}
            onKeyDown={this.props.addImage}
            id="elementButton"
            className="insert-toolbar__button"
            data-test="insert-toolbar__add-image"
            id="insert-toolbar__add-image"
          >
            <ImageSVG alt="add image" />
            Image
          </button>
        </div>
        {this.props.canEdit && (
          <div className="insert-toolbar__container-right">
            <button
              onMouseDown={this.props.togglePageVersion}
              onKeyDown={this.props.togglePageVersion}
              id="elementButton"
              className={`insert-toolbar__button
              ${(this.props.isPageVersionOpen) ? 'insert-toolbar__button--highlighted' : ''}`}
              data-test="insert-toolbar__show-page-version"
            >
              <HistorySVG alt="show page version" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

InsertToolbar.propTypes = {
  addCodeEditor: PropTypes.func.isRequired,
  addIframe: PropTypes.func.isRequired,
  addImage: PropTypes.func.isRequired,
  addTextEditor: PropTypes.func.isRequired,
  addQuestionEditor: PropTypes.func.isRequired,
  addVideo: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  isPageVersionOpen: PropTypes.bool.isRequired,
  togglePageVersion: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  canEdit: state.user.canEdit,
  isPageVersionOpen: state.pageVersion.isPageVersionOpen
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addCodeEditor,
  addIframe,
  addImage,
  addTextEditor,
  addQuestionEditor,
  addVideo,
  togglePageVersion
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InsertToolbar);
