import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ConfirmUser from './Modal/ConfirmUser/ConfirmUser.jsx';
import ExamplesModal from './Modal/ExamplesModal/ExamplesModal.jsx';
import Login from './Modal/Login/Login.jsx';
import Modal from './Modal/Modal.jsx';
import PasswordForgot from './Modal/PasswordForgot/PasswordForgot.jsx';
import ShareModal from './Modal/ShareModal/ShareModal.jsx';
import SignUp from './Modal/SignUp/SignUp.jsx';
import PagesList from './Modal/PagesList/PagesList.jsx';
import PasswordReset from './Modal/PasswordReset/PasswordReset.jsx';

import Canvas from './Canvas/Canvas.jsx';
import MainToolbar from './MainToolbar/MainToolbar.jsx';

import * as editorActions from '../action/editors.js';
import * as mainToolbarActions from '../action/mainToolbar.js';
import * as pageActions from '../action/page.js';
import * as userActions from '../action/user.js';

const axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.authAndLoadPage = this.authAndLoadPage.bind(this);
    this.authLoadedPage = this.authLoadedPage.bind(this);
    this.projectID = this.projectID.bind(this);
    this.resetPage = this.resetPage.bind(this);
    this.savePage = this.savePage.bind(this);
  }

  componentDidMount() {
    this.authAndLoadPage();
  }

  onKeyPressed(e) {
    if (e.metaKey || e.ctrlKey) {
      switch (e.keyCode) {
        case 78: // n,N
          // new
          break;
        case 79: // o,O
          this.props.viewPagesModal();
          e.preventDefault();
          break;
        case 83: // s,S
          this.savePage();
          e.preventDefault();
          break;
        default:
          break;
      }
    }
  }

  projectID() {
    const location = this.props.location.pathname;
    const projectID = location.match(/\/pebl\/([\w-].*)/);
    return projectID ? projectID[1] : null;
  }

  resetPage() {
    const location = this.props.location.pathname;
    const tokenID = location.match(/\/reset\/([\w-].*)/);
    return tokenID ? tokenID[1] : null;
  }

  userConfirmation() {
    const location = this.props.location.pathname;
    const tokenID = location.match(/\/confirmation/);
    return tokenID ? true : null;
  }

  authAndLoadPage() {
    if (this.userConfirmation()) {
      this.props.viewConfirmUserModal();
    } else if (this.resetPage()) {
      this.props.viewResetModal();
    } else if (this.projectID()) {
      this.props.setEditAccess(false);
      const projectID = this.projectID();
      axios.get(`/api/page/${this.projectID()}`)
        .then((res) => {
          this.props.loadPage(res.data[0].id, res.data[0].title, res.data[0].preview, res.data[0].layout);
          this.props.loadEditors(res.data[0].editors, res.data[0].editorIndex);
          axios.get('/api/user')
            .then((res1) => {
              if (res1.data.pages && res1.data.pages.includes(projectID)) {
                this.props.setEditAccess(true);
              }
            });
        });
    }
    axios.get('/api/user')
      .then((res) => {
        if (res.data.name) {
          this.props.setUserName(res.data.name);
        }
      });
  }

  authLoadedPage() {
    if (this.projectID()) {
      this.props.setEditAccess(false);
      const projectID = this.projectID();
      axios.get('/api/user')
        .then((res1) => {
          if (res1.data.pages && res1.data.pages.includes(projectID)) {
            this.props.setEditAccess(true);
          }
        });
    }
  }

  savePage() {
    let now = new Date();
    now = now.toISOString();
    if (this.props.name) {
      if (this.props.id.length === 0) {
        this.props.submitPage(
          '',
          this.props.pageTitle,
          this.props.preview,
          this.props.editors,
          this.props.editorIndex,
          this.props.layout,
          now,
          now
        );
      } else if (this.props.canEdit) {
        this.props.updatePage(
          this.props.id,
          this.props.pageTitle,
          this.props.preview,
          this.props.editors,
          this.props.editorIndex,
          this.props.layout,
          now
        );
      } else {
        // this is for fork and save
        this.props.submitPage(
          this.props.id,
          `${this.props.pageTitle}-copy`,
          this.props.preview,
          this.props.editors,
          this.props.editorIndex,
          this.props.layout,
          now,
          now
        );
      }
    } else {
      this.props.viewLoginModal();
    }
  }

  render() {
    return (
      <div // eslint-disable-line
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >
        <nav className="main-nav">
          <MainToolbar
            addCodeEditor={this.props.addCodeEditor}
            addTextEditor={this.props.addTextEditor}
            addQuestionEditor={this.props.addQuestionEditor}
            addIframe={this.props.addIframe}
            addImage={this.props.addImage}
            canEdit={this.props.canEdit}
            isFileDropdownOpen={this.props.isFileDropdownOpen}
            isAccountDropdownOpen={this.props.isAccountDropdownOpen}
            name={this.props.name}
            pageTitle={this.props.pageTitle}
            preview={this.props.preview}
            projectID={this.projectID}
            setPageTitle={this.props.setPageTitle}
            setEditorMode={this.props.setEditorMode}
            savePage={this.savePage}
            toggleFileDropdown={this.props.toggleFileDropdown}
            toggleAccountDropdown={this.props.toggleAccountDropdown}
            togglePreviewMode={this.props.togglePreviewMode}
            unsavedChanges={this.props.unsavedChanges}
            viewExamplesModal={this.props.viewExamplesModal}
            viewPagesModal={this.props.viewPagesModal}
            viewLoginModal={this.props.viewLoginModal}
            viewShareModal={this.props.viewShareModal}
            viewSignUpModal={this.props.viewSignUpModal}
          />
        </nav>
        <Canvas
          layout={this.props.layout}
          name={this.props.name}
          preview={this.props.preview}
          rgl={this.props.rgl}
          setPageLayout={this.props.setPageLayout}
          editorIndex={this.props.editorIndex}
          textHeights={this.props.textHeights}

          updateFile={this.props.updateFile}
          editors={this.props.editors}
          setCurrentEditor={this.props.setCurrentEditor}
          removeEditor={this.props.removeEditor}
          duplicateEditor={this.props.duplicateEditor}
          setEditorSize={this.props.setEditorSize}
          setEditorPosition={this.props.setEditorPosition}
          setCurrentFile={this.props.setCurrentFile}

          playCode={this.props.playCode}
          stopCode={this.props.stopCode}
          startCodeRefresh={this.props.startCodeRefresh}
          stopCodeRefresh={this.props.stopCodeRefresh}
          clearConsoleOutput={this.props.clearConsoleOutput}
          updateConsoleOutput={this.props.updateConsoleOutput}

          setInnerWidth={this.props.setInnerWidth}
          setInnerHeight={this.props.setInnerHeight}

          updateTextChange={this.props.updateTextChange}
          updateImageChange={this.props.updateImageChange}
          updateTextBackColor={this.props.updateTextBackColor}

          setIframeURL={this.props.setIframeURL}

          setQuestionInnerHeight={this.props.setQuestionInnerHeight}
          updateQuestionChange={this.props.updateQuestionChange}
          updateAnswerChange={this.props.updateAnswerChange}

          setImageURL={this.props.setImageURL}
          resizeTextEditor={this.props.resizeTextEditor}
          updateTextHeight={this.props.updateTextHeight}
        />
        <Modal
          size="large"
          isOpen={this.props.isPagesModalOpen}
          closeModal={this.props.closePagesModal}
        >
          <PagesList
            folders={this.props.folders}
            pages={this.props.pages}
            deletePage={this.props.deletePage}
            fetchAllPages={this.props.fetchAllPages}
          />
        </Modal>

        <Modal
          size="large"
          isOpen={this.props.isExamplesModalOpen}
          closeModal={this.props.closeExamplesModal}
        >
          <ExamplesModal />
        </Modal>

        <Modal
          size="large"
          isOpen={this.props.isLoginModalOpen}
          closeModal={this.props.closeLoginModal}
        >
          <Login
            authLoadedPage={this.authLoadedPage}
            loginName={this.props.loginName}
            loginPassword={this.props.loginPassword}
            updateUserName={this.props.updateUserName}
            updateUserPassword={this.props.updateUserPassword}
            setUserName={this.props.setUserName}
            closeLoginModal={this.props.closeLoginModal}
            viewForgotModal={this.props.viewForgotModal}
            isForgotModalOpen={this.props.isForgotModalOpen}
          />
        </Modal>

        <Modal
          size="large"
          isOpen={this.props.isForgotModalOpen}
          closeModal={this.props.closeForgotModal}
        >
          <PasswordForgot
            isForgotModalOpen={this.props.isForgotModalOpen}
          />
        </Modal>

        <Modal
          size="large"
          isOpen={this.props.isResetModalOpen}
          closeModal={this.props.closeResetModal}
        >
          <PasswordReset
            isResetModalOpen={this.props.isResetModalOpen}
            location={this.props.location}
          />
        </Modal>

        <Modal
          size="large"
          isOpen={this.props.isSignUpModalOpen}
          closeModal={this.props.closeSignUpModal}
        >
          <SignUp
            authLoadedPage={this.authLoadedPage}
            loginName={this.props.loginName}
            loginPassword={this.props.loginPassword}
            updateUserName={this.props.updateUserName}
            updateUserPassword={this.props.updateUserPassword}
            signUserUp={this.props.signUserUp}
            setUserName={this.props.setUserName}
            setUserType={this.props.setUserType}
            userType={this.props.userType}
            closeSignUpModal={this.props.closeSignUpModal}
          />
        </Modal>
        <Modal
          size="small"
          isOpen={this.props.isConfirmUserModalOpen}
          closeModal={this.props.closeConfirmUserModal}
        >
          <ConfirmUser
            location={this.props.location}
          />
        </Modal>
        <Modal
          size="small"
          isOpen={this.props.isShareModalOpen}
          closeModal={this.props.closeShareModal}
        >
          <ShareModal
            pageTitle={this.props.pageTitle}
          />
        </Modal>

      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  editors: PropTypes.shape({}).isRequired,
  editorIndex: PropTypes.number.isRequired,

  pageTitle: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  layout: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rgl: PropTypes.shape({}).isRequired,
  folders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  pages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  preview: PropTypes.bool.isRequired,
  unsavedChanges: PropTypes.bool.isRequired,
  textHeights: PropTypes.shape({}).isRequired,

  canEdit: PropTypes.bool.isRequired,
  loginName: PropTypes.string.isRequired,
  loginPassword: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  setUserName: PropTypes.func.isRequired,
  setUserType: PropTypes.func.isRequired,

  isFileDropdownOpen: PropTypes.bool.isRequired,
  isAccountDropdownOpen: PropTypes.bool.isRequired,
  isPagesModalOpen: PropTypes.bool.isRequired,
  isLoginModalOpen: PropTypes.bool.isRequired,
  isForgotModalOpen: PropTypes.bool.isRequired,
  isSignUpModalOpen: PropTypes.bool.isRequired,
  isResetModalOpen: PropTypes.bool.isRequired,

  isExamplesModalOpen: PropTypes.bool.isRequired,
  viewExamplesModal: PropTypes.func.isRequired,
  closeExamplesModal: PropTypes.func.isRequired,

  setCurrentEditor: PropTypes.func.isRequired,
  removeEditor: PropTypes.func.isRequired,
  duplicateEditor: PropTypes.func.isRequired,
  loadEditors: PropTypes.func.isRequired,
  setEditorPosition: PropTypes.func.isRequired,
  setEditorSize: PropTypes.func.isRequired,
  addCodeEditor: PropTypes.func.isRequired,
  playCode: PropTypes.func.isRequired,
  stopCode: PropTypes.func.isRequired,
  startCodeRefresh: PropTypes.func.isRequired,
  stopCodeRefresh: PropTypes.func.isRequired,
  setEditorMode: PropTypes.func.isRequired,
  clearConsoleOutput: PropTypes.func.isRequired,
  updateConsoleOutput: PropTypes.func.isRequired,
  addTextEditor: PropTypes.func.isRequired,
  addQuestionEditor: PropTypes.func.isRequired,
  updateTextChange: PropTypes.func.isRequired,
  updateTextBackColor: PropTypes.func.isRequired,
  addIframe: PropTypes.func.isRequired,
  setIframeURL: PropTypes.func.isRequired,
  updateFile: PropTypes.func.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  setInnerWidth: PropTypes.func.isRequired,
  setInnerHeight: PropTypes.func.isRequired,
  setQuestionInnerHeight: PropTypes.func.isRequired,
  updateQuestionChange: PropTypes.func.isRequired,
  updateAnswerChange: PropTypes.func.isRequired,
  addImage: PropTypes.func.isRequired,
  setImageURL: PropTypes.func.isRequired,
  updateImageChange: PropTypes.func.isRequired,
  resizeTextEditor: PropTypes.func.isRequired,
  updateTextHeight: PropTypes.func.isRequired,

  togglePreviewMode: PropTypes.func.isRequired,
  setPageTitle: PropTypes.func.isRequired,
  setPageLayout: PropTypes.func.isRequired,
  submitPage: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  loadPage: PropTypes.func.isRequired,
  deletePage: PropTypes.func.isRequired,
  fetchAllPages: PropTypes.func.isRequired,
  setEditAccess: PropTypes.func.isRequired,

  viewPagesModal: PropTypes.func.isRequired,
  closePagesModal: PropTypes.func.isRequired,
  viewLoginModal: PropTypes.func.isRequired,
  closeLoginModal: PropTypes.func.isRequired,
  viewSignUpModal: PropTypes.func.isRequired,
  closeSignUpModal: PropTypes.func.isRequired,
  toggleFileDropdown: PropTypes.func.isRequired,
  toggleAccountDropdown: PropTypes.func.isRequired,
  isShareModalOpen: PropTypes.bool.isRequired,
  closeShareModal: PropTypes.func.isRequired,
  viewShareModal: PropTypes.func.isRequired,
  closeForgotModal: PropTypes.func.isRequired,
  viewForgotModal: PropTypes.func.isRequired,
  closeResetModal: PropTypes.func.isRequired,
  viewResetModal: PropTypes.func.isRequired,
  closeConfirmUserModal: PropTypes.func.isRequired,
  viewConfirmUserModal: PropTypes.func.isRequired,
  isConfirmUserModalOpen: PropTypes.bool.isRequired,


  updateUserName: PropTypes.func.isRequired,
  updateUserPassword: PropTypes.func.isRequired,
  signUserUp: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    editors: state.editorsReducer.editors,
    editorIndex: state.editorsReducer.editorIndex,

    layout: state.page.layout,
    rgl: state.page.rgl,
    pageTitle: state.page.pageTitle,
    id: state.page.id,
    folders: state.page.folders,
    pages: state.page.pages,
    preview: state.page.preview,
    unsavedChanges: state.page.unsavedChanges,
    createDate: state.page.createDate,
    textHeights: state.page.textHeights,

    canEdit: state.user.canEdit,
    loginName: state.user.loginName,
    loginPassword: state.user.loginPassword,
    name: state.user.name,
    userType: state.user.type,

    isAccountDropdownOpen: state.mainToolbar.isAccountDropdownOpen,
    isExamplesModalOpen: state.mainToolbar.isExamplesModalOpen,
    isFileDropdownOpen: state.mainToolbar.isFileDropdownOpen,
    isPagesModalOpen: state.mainToolbar.isPagesModalOpen,
    isShareModalOpen: state.mainToolbar.isShareModalOpen,

    isLoginModalOpen: state.mainToolbar.isLoginModalOpen,
    isSignUpModalOpen: state.mainToolbar.isSignUpModalOpen,
    isForgotModalOpen: state.mainToolbar.isForgotModalOpen,
    isResetModalOpen: state.mainToolbar.isResetModalOpen,
    isConfirmUserModalOpen: state.mainToolbar.isConfirmUserModalOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    editorActions,
    mainToolbarActions,
    pageActions,
    userActions),
  dispatch);
}
export default (connect(mapStateToProps, mapDispatchToProps)(App));
