import React from 'react';
import PropTypes from 'prop-types';
import axiosOrg from 'axios';
import URL from 'url';

import axios from '../../../../../utils/axios';
import EditorFile from './EditorFile.jsx';
import FileUpload from '../../FileUpload/FileUpload.jsx';

import { MEDIA_FILE_REGEX } from '../../../../../constants/widgetConstants.js';

const CODE_FILE_REGEX = /.+\.(csv|txt|json|js|css)$/i;

require('./editorFiles.scss');

class EditorFiles extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadMemoryConsumed();
    this.state = {
      isFileUploadOpen: false,
      isFileUploading: false
    };
  }

  openFileUpload = () => {
    this.setState({ isFileUploadOpen: true });
  }

  closeFileUpload = () => {
    this.setState({ isFileUploadOpen: false });
  }

  startFileUpload = () => {
    this.setState({ isFileUploading: true });
  }

  stopFileUpload = () => {
    this.setState({ isFileUploading: false });
  }

  onDrop=(files) => {
    const file = files[0];
    if (file.name.match(CODE_FILE_REGEX)) {
      axiosOrg.get(file.preview)
        .then((data) => {
          this.props.addFileToEditor(file.name, data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (file.name.match(MEDIA_FILE_REGEX)) {
      const memoryConsumedInMegaBytes = Math.ceil(this.props.memoryConsumed / 1000000);
      const memoryOfNewFile = Math.ceil(file.size / 1000000);
      if ((memoryConsumedInMegaBytes + memoryOfNewFile) < 1024) {
        this.startFileUpload();
        axios.get(`/upload/${this.props.name}/images`, {
          params: {
            filename: file.name,
            filetype: file.type
          }
        })
          .then((result) => {
            const signedUrl = result.data;
            const options = {
              headers: {
                'Content-Type': file.type
              }
            };

            return axiosOrg.put(signedUrl, file, options);
          })
          .then((result) => {
            const url = URL.parse(result.request.responseURL);
            this.props.addMediaFile(file.name, `https://s3.amazonaws.com/${process.env.S3_BUCKET}${url.pathname}`);
            this.stopFileUpload();
            this.closeFileUpload();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      alert('Cannot upload file as max memory consumed');
    }
  }

  render() {
    return (
      <div className='editor-toolbar__files-container'>
        <ul className='editor-toolbar__files'>
          {this.props.editorView === 'tabbed' && (
            <li
              key='preview'
              className='editor-toolbar__file'
            >
              <button
                onClick={() => {
                  this.props.viewEditorPreview();
                }}
                className={
                  `editor-toolbar__file-button
                  ${(this.props.currentFile === -1) ? 'editor-toolbar__file-button--selected' : ''}`
                }
                data-test="editor-toolbar__file-name"
              >
                Preview
              </button>
            </li>
          )}
          {
            this.props.files.map((file, index) => {
              const isImage = 'externalLink' in file;
              return (
                <EditorFile
                  currentFile={this.props.currentFile}
                  deleteFileFromEditor={this.props.deleteFileFromEditor}
                  file={file}
                  id={this.props.id}
                  index={index}
                  isImage={isImage}
                  openFileView={this.props.openFileView}
                  setCurrentFile={this.props.setCurrentFile}
                />
              );
            })
          }
        </ul>
        {
          (this.props.editorMode === 'p5' || this.props.editorMode === 'webdev') &&
          (
            <button
              className="editor-toolbar__add-file-button"
              onClick={this.openFileUpload}
              data-test='editor-toolbar__add-file-button'
            >
              Add File
            </button>
          )
        }
        {this.state.isFileUploadOpen && (
          <div
            tabIndex="0" //eslint-disable-line
            className="editor-toolbar__image-upload"
            data-test="file-upload__container"
          >
            <button
              className="editor-toolbar__image-close"
              onClick={this.closeFileUpload}
            >
              <i className="fas fa-times"></i>
            </button>
            <FileUpload
              files={this.props.files}
              addFileToEditor={this.props.addFileToEditor}
              closeFileUpload={this.closeFileUpload}
              onDrop={this.onDrop}
              urlSubmitted={this.props.addMediaFile}
              imageURL={this.props.imageURL}
              readOnly={false}
              container="editor"
              isSmall={false}
              isFileUploading={this.state.isFileUploading}
            />
          </div>
        )}
      </div>
    );
  }
}

EditorFiles.propTypes = {
  addMediaFile: PropTypes.func.isRequired,
  addFileToEditor: PropTypes.func.isRequired,
  currentFile: PropTypes.number.isRequired,
  deleteFileFromEditor: PropTypes.func.isRequired,
  editorMode: PropTypes.string.isRequired,
  editorView: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })).isRequired,
  id: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  openFileView: PropTypes.func.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  viewEditorPreview: PropTypes.func.isRequired,
  loadMemoryConsumed: PropTypes.func.isRequired,
  memoryConsumed: PropTypes.number.isRequired,
};

export default EditorFiles;
