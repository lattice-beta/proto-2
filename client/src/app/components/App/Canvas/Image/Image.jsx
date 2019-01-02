import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import PropTypes from 'prop-types';
import React from 'react';
import ReactCrop from 'react-image-crop';
import axiosOrg from 'axios';
import URL from 'url';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'react-image-crop/lib/ReactCrop.scss';

import { setImageURL, setImageCrop } from '../../../../action/editors.js';
import axios from '../../../../utils/axios';
import * as WidgetSize from '../../../../constants/widgetConstants.js';
import FileUpload from '../../Shared/FileUpload/FileUpload.jsx';

const MEDIA_FILE_REGEX = /.+\.(gif|jpg|jpeg|png|bmp)$/i;
const VIDEO_FILE_REGEX = /.+\.(mp4|avi|mov|mpg|wmv)$/i;

require('./image.scss');

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      showUploadPopup: false,
      isImageSmall: false,
      isFileUploading: false,
      isVideo: false,
      crop: {
        x: 50,
        y: 50,
        width: 50,
        height: 50
      }
    };
    this.setImageURL = url => this.props.setImageURL(this.props.id, url);
    this.setImageCrop = (crop) => {
      console.log(crop);
      this.props.setImageCrop(this.props.id, crop);
    };
    this.onDrop = this.onDrop.bind(this);
    this.urlSubmitted = (event, value) => {
      event.preventDefault();
      this.props.setImageURL(this.props.id, value);
      this.renderUploadPopup(false);
    };
  }

  componentDidMount() {
    this.imageSizeChanged();
    if (this.props.imageURL && this.props.imageURL.match(VIDEO_FILE_REGEX)) {
      this.setState({ isVideo: true });
    }
  }

  componentDidUpdate(prevProps) {
    this.imageSizeChanged();
    if (prevProps.imageURL !== this.props.imageURL) {
      if (this.props.imageURL && this.props.imageURL.match(VIDEO_FILE_REGEX)) {
        this.setState({ isVideo: true }); //eslint-disable-line
      }
    }
  }

  onDrop(files) {
    const file = files[0];
    if (file.name.match(MEDIA_FILE_REGEX)) {
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
          this.setUploadPopupVisibility(false);
          this.setImageURL(`https://s3.amazonaws.com/${process.env.S3_BUCKET}${url.pathname}`);
          this.stopFileUpload();
          this.renderUploadPopup(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  setUploadPopupVisibility(value) {
    const newState = { ...this.state };
    newState.showUploadPopup = value;
    this.setState(newState);
  }

  startFileUpload = () => {
    this.setState({ isFileUploading: true });
  }

  stopFileUpload = () => {
    this.setState({ isFileUploading: false });
  }


  imageSizeChanged = () => {
    const isImageSmall = (this.imageWidgetRef.clientWidth < WidgetSize.IMAGE_RESPONSIVE_TRIGGER_WIDTH ||
    this.imageWidgetRef.clientHeight < WidgetSize.IMAGE_RESPONSIVE_TRIGGER_HEIGHT);
    if (this.state.isImageSmall !== isImageSmall) {
      this.setState({ isImageSmall });
    }
  }

  handleOnClick() {
    const newState = { ...this.state };
    return (
      this.imageWidgetRef && (this.state.isImageSmall)
    ) &&
    this.setUploadPopupVisibility(!newState.showUploadPopup);
  }

  renderUploadPopup(sizeOverride) {
    return (
      <FileUpload
        onDrop={this.onDrop}
        urlSubmitted={this.urlSubmitted}
        imageURL={this.props.imageURL}
        container="image"
        isSmall={sizeOverride && this.state.isImageSmall}
        isFileUploading={this.state.isFileUploading}
      />
    );
  }

  render() {
    console.log(this.props.crop);
    return (
      <div>
        <div
          ref={(ref) => { this.imageWidgetRef = ref; }}
          className={`
          image__container
          ${this.props.preview ? '' : 'image__container--edit'}
          ${this.props.name && this.imageWidgetRef && (this.state.isImageSmall) ? 'image__container--small' : ''}
          ${this.props.imageURL && 'image__container--exists'}
          `}
          data-test="image__container"
        >
          {(this.props.imageURL && !this.state.isVideo) && (
            <div>
              <img
                className="element__image"
                src={this.props.imageURL}
                alt=""
                data-test="image__main"
              />
              <ReactCrop
                src={this.props.imageURL}
                crop={this.props.crop}
                onChange={(crop) => {
                  console.log(crop);
                  this.setImageCrop(crop);
                }}
              />
            </div>
          )}
          {(this.props.imageURL && this.state.isVideo) && (
            // eslint-disable-next-line
            <video width="100%" controls>
              <source src={this.props.imageURL} />
              Your browser does not support HTML5 video.
            </video>
          )}
          {!this.props.preview && !this.props.name && (
            <div className="image__login">

              <div
                className={`${!this.props.imageURL ? 'image__content' : 'image__content image__replace-content'}`}
              >
                <div className="image__title">
                Log In to Upload Images
                </div>
              </div>
            </div>
          )}

          {!this.props.preview && this.props.name && (
            <div
              tabIndex="0" //eslint-disable-line
              role="button"
              className={
                `image__login ${!this.props.imageURL ? 'image__content' : 'image__content image__replace-content'}`
              }
              data-test="image__upload-container"
              onClick={() => { this.handleOnClick(); }}
              onKeyUp={() => this.handleOnClick()}
            >
              {this.renderUploadPopup(true)}
            </div>
          )}

          {this.state.showUploadPopup && (
            <div
              className='image__container image__container--popup'
              data-test="image__upload-container"
            >
              {this.renderUploadPopup(false)}
            </div>
          )}
        </div>
      </div>
    );
  }
}

Image.propTypes = {
  id: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  preview: PropTypes.bool.isRequired,
  setImageCrop: PropTypes.func.isRequired,
  setImageURL: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    name: state.user.name,
    preview: state.page.preview
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({
  setImageCrop,
  setImageURL
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Image);
