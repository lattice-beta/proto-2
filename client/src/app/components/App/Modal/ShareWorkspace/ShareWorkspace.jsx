import { EditorState, ContentState } from 'draft-js';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitPage } from '../../../../action/page.js';
import { viewLoginModal } from '../../../../action/mainToolbar.js';
import * as PageDefaults from '../../../../constants/pageConstants.js';
import { convertWorkspaceDescHeight } from '../../../../utils/pixel-to-grid.js';

require('./shareWorkspace.scss');

class ShareWorkspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGuest: false
    };
  }

  continueAsGuest = () => {
    this.setState({ isGuest: true });
  }

  isLoggedIn=() => !(this.props.name === '' || this.props.name === null)

  onEnterPress = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  saveAndShareWorkspace=() => {
    const layout = PageDefaults.STARTER_WORKSPACE_LAYOUT;
    const textAreaLineHeight = parseFloat(getComputedStyle(this.desc).fontSize) * 1.2;
    const yValue = convertWorkspaceDescHeight(
      this.desc.value.length,
      textAreaLineHeight,
      this.props.rgl.margin,
      this.props.rgl.rowHeight,
      layout[0].maxH
    );
    layout[0].h = yValue;
    layout[1].y = yValue + 1;
    const descText = this.desc.value.replace(/[\r\n]+/g, ' ');

    const tempDesc = {
      type: 'text',
      id: 'editor-0',
      index: 0,
      editorState: EditorState.createWithContent(
        ContentState.createFromText(descText)
      ),
      backColor: 'transparent'
    };
    const tempEditor = JSON.parse(JSON.stringify(this.props.workspace));
    tempEditor.id = 'editor-1';
    tempEditor.index = 1;
    tempEditor.type = 'code';
    tempEditor.editorView = 'tabbed';
    tempEditor.isPlaying = true;
    tempEditor.innerWidth = 200;
    tempEditor.currentFile = -1;
    this.props.submitPage(
      `src-${this.props.id}`,
      this.title.value,
      this.title.value,
      '',
      {
        'editor-0': tempDesc,
        'editor-1': tempEditor,
      },
      2,
      layout,
      'fromWP',
      PageDefaults.DEFAULT_WORKSPACE_MODE,
      [],
      this.isLoggedIn(),
      !(this.props.userType === 'student'),
      document.getElementById('content-canvas')
    );
    this.props.closeModal();
  }

  render() {
    return (
      <section className='share-workspace__container'>
        {(this.isLoggedIn() || this.state.isGuest) ? (
          <div className='share-workspace__option'>
            <h1 className='share-workspace__text-primary'>
              Save and share your project!
            </h1>
            <p className='share-workspace__text-secondary'>
              You will have a chance to edit your project page.
            </p>
            <label
              htmlFor='share-workspace__title'
              className='share-workspace__label'
            >
              title
            </label>
            <input
              id='share-workspace__title'
              className='share-workspace__title'
              ref={(element) => { this.title = element; }}
            />
            <label
              htmlFor='share-workspace__desc'
              className='share-workspace__label'
            >
              Description
            </label>
            <textarea
              id='share-workspace__desc'
              className='share-workspace__desc'
              ref={(element) => { this.desc = element; }}
              onKeyDown={this.onEnterPress}
            />

            <div className='share-workspace__button-container'>
              <button
                className='share-workspace__button'
                onClick={this.props.closeModal}
              >
                Cancel
              </button>
              <button
                className='share-workspace__button'
                onClick={this.saveAndShareWorkspace}
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div className='share-workspace__option'>
            <h1 className='share-workspace__text-primary'>
              Save and share your project!
            </h1>
            <p className='share-workspace__text-secondary'>
              You are not logged in. How would you like to continue?
            </p>
            <div className='share-workspace__button-container'>
              <button
                className='share-workspace__button'
                onClick={() => {
                  this.props.closeModal();
                  this.props.viewLoginModal();
                }}
              >
                Log In
              </button>
              <button
                className='share-workspace__button'
                onClick={this.continueAsGuest}
              >
                Share As Guest
              </button>
            </div>
          </div>
        )}

      </section>
    );
  }
}


ShareWorkspace.propTypes = {
  closeModal: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rgl: PropTypes.shape({
    margin: PropTypes.arrayOf(PropTypes.number),
    rowHeight: PropTypes.number,
  }).isRequired,
  submitPage: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
  viewLoginModal: PropTypes.func.isRequired,
  workspace: PropTypes.shape({}).isRequired,
};


function mapStateToProps(state) {
  return {
    name: state.user.name,
    rgl: state.page.rgl,
    id: state.page.id,
    userType: state.user.type
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({
  submitPage,
  viewLoginModal
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ShareWorkspace);
