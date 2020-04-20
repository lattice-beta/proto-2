import PropTypes from 'prop-types';
import React from 'react';
import ReactLoading from 'react-loading';
import { connect } from 'react-redux';

import Dropzone from 'react-dropzone';
import Modal from '../../Modal/Modal.jsx';

import UploadSVG from '../../../../images/upload.svg';

require('./fileUpload.scss');

const VALID_FILE_EXT = ['.js', '.css'];
const VALID_UPLOAD_FILE_EXT = ['.js', '.css', '.gif', '.png', '.jpg', '.jpeg', '.svg', '.wav', '.mp3', '.ttf', '.otf'];
const VALID_IMG_UPLOAD_FILE_EXT = ['.gif', '.png', '.jpg', '.jpeg', '.svg'];

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isToolbarVisible: false,
      isFileTypeWarningShowing: false,
      fileTypeWarning: '',
      isUploadFileTypeWarningShowing: false,
      uploadFileTypeWarning: ''
    };
  }

  addFileToEditor = () => {
    const fileName = this.fileName.value;
    if (!this.checkFileExtension(fileName, VALID_FILE_EXT)) {
      this.setState({
        fileTypeWarning: 'File must have extension .js or .css',
        isFileTypeWarningShowing: true
      });
    } else if (this.checkDuplicateFileNames(fileName)) {
      this.setState({
        fileTypeWarning: 'File already exists',
        isFileTypeWarningShowing: true
      });
    } else {
      this.props.addFileToEditor(this.fileName.value, '');
      this.props.closeFileUpload();
      this.setState({
        fileTypeWarning: '',
        isFileTypeWarningShowing: false
      });
    }
  }

  fileOnDrop = (files) => {
    if (this.props.container === 'image') {
      this.validateFile(
        files,
        VALID_IMG_UPLOAD_FILE_EXT,
        'File must have extension .svg .png .jpg or .jpeg',
      );
    } else {
      this.validateFile(
        files,
        VALID_UPLOAD_FILE_EXT,
        'File must have extension .js .css .svg .png .jpg .jpeg .wav .mp3 .ttf or .otf',
      );
    }
  }

  validateFile = (files, validExtensions, message) => {
    if (this.checkFileExtension(files[0].name, validExtensions)) {
      this.props.onDrop(files);
      this.setState({
        uploadFileTypeWarning: '',
        isUploadFileTypeWarningShowing: false
      });
    } else {
      this.setState({
        uploadFileTypeWarning: message,
        isUploadFileTypeWarningShowing: true
      });
    }
  }

  closeToolbar = () => { this.setState({ isToolbarVisible: false }); };

  openToolbar = () => { this.setState({ isToolbarVisible: true }); };

  checkDuplicateFileNames(fileName) {
    let isDuplicateFileName = false;
    this.props.files.forEach((file) => {
      if (fileName === file.name) {
        isDuplicateFileName = true;
      }
      return isDuplicateFileName;
    });
    return isDuplicateFileName;
  }

  checkFileExtension(fileName, exts) {
    return (new RegExp(`(${exts.join('|').replace(/\./g, '\\.')})$`)).test(fileName);
  }

  renderContent = () => (
    <div>
      {!this.props.name && (
        <p className="file-upload__upload-notice">
          Please Log In to Upload Images
        </p>
      )}

      {this.props.name && (
        <div className="file-upload__container">
          <div className="file-upload__title">Add file</div>
          {this.props.container === 'editor' && (
            <div>

              <div
                className="file-upload__sub-container"
              >
                <input
                  className="file-upload__input"
                  data-test="file-upload__url-input"
                  type="text"
                  ref={(element) => { this.fileName = element; }}
                  defaultValue={this.props.imageURL}
                />
                <button
                  className="file-upload__button"
                  onClick={this.addFileToEditor}
                >
                  Add File
                </button>
              </div>
              {this.state.isFileTypeWarningShowing && (
                <div className="file-upload__warning">
                  {this.state.fileTypeWarning}
                </div>
              )}
              <div className="file-upload__sub-title">OR</div>
            </div>
          )}
          <div
            className="file-upload__upload-container"
            data-test="file-upload__upload-container"
            ref={(input) => { this.fileUpload = input; }}
          >

            <Dropzone
              onDrop={this.fileOnDrop}
              className="file-upload__dropzone"
            >
              <div
                className="file-upload__drop"
                data-test="file-upload__drop"
              >
                <div className="file-upload__svg">
                  <UploadSVG alt="upload image" />
                </div>
                <div className="file-upload__svg--text">Drop a file or click to upload</div>
              </div>
            </Dropzone>
            {this.state.isUploadFileTypeWarningShowing && (
              <div className="file-upload__warning">
                {this.state.uploadFileTypeWarning}
              </div>
            )}
            {this.props.isFileUploading && (
              <ReactLoading
                className="file-upload__image-upload-gif"
                height="20%"
                width="20%"
                color="#B1B1B1"
              />
            )}
            {this.props.container === 'image' && (
              <div>
                <div className="file-upload__sub-title">or add a URL</div>
                <div
                  className="file-upload__url"
                  data-test="file-upload__url"
                >
                  <form
                    className="file-upload__add-url"
                    onSubmit={e => this.props.urlSubmitted(e, this.url.value)}
                  >
                    <label htmlFor="file-upload-name" className="file-upload__label">
                      <input
                        id="file-upload-name"
                        className="file-upload__input"
                        data-test="file-upload__url-input"
                        type="text"
                        ref={(element) => { this.url = element; }}
                        defaultValue={this.props.imageURL}
                        readOnly={this.props.preview}
                      />
                    </label>
                    <input
                      className="file-upload__button"
                      type="submit"
                      value="Upload New"
                      data-test="file-upload__upload"
                    />
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  render() {
    return (
      <div>
        {this.props.isSmall && (
          <div>
            <button
              className="file-upload__upload-button"
              onMouseDown={this.openToolbar}
              onKeyDown={this.openToolbar}
            >
              <UploadSVG alt="upload profile image" />
            </button>
            {this.state.isToolbarVisible && (
              <Modal
                size="image"
                isOpen={this.state.isToolbarVisible}
                closeModal={this.closeToolbar}
              >
                {this.renderContent()}
              </Modal>
            )}
          </div>
        )}
        {!this.props.isSmall && (
          <div>
            {this.renderContent()}
          </div>
        )}
      </div>
    );
  }
}


FileUpload.propTypes = {
  addFileToEditor: PropTypes.func.isRequired,
  closeFileUpload: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })).isRequired,
  container: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
  isFileUploading: PropTypes.bool.isRequired,
  isSmall: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onDrop: PropTypes.func.isRequired,
  preview: PropTypes.bool.isRequired,
  urlSubmitted: PropTypes.func.isRequired,
};


function mapStateToProps(state) {
  return {
    name: state.user.name,
    preview: state.page.preview
  };
}

export default connect(mapStateToProps, null)(FileUpload);
