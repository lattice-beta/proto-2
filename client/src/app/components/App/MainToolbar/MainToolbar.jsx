import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip-lite';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import UserAccount from '../../Shared/UserAccount/UserAccount.jsx';
import FileMenu from './FileMenu/FileMenu.jsx';
import HelpMenu from './HelpMenu/HelpMenu.jsx';
import Preferences from '../Preferences/Preferences.jsx';
import InsertToolbar from './InsertToolbar/InsertToolbar.jsx';
import Modal from '../Modal/Modal.jsx';
import EditAccessDisabledOnMobile from '../Modal/EditAccessDisabledOnMobile/EditAccessDisabledOnMobile.jsx';
import NavigationHamburger from '../Navigation/MobileView/NavigationHamburger.jsx';
import ToolbarLogo from '../../../images/logo.svg';
import CheckSVG from '../../../images/check.svg';
import PreferencesSVG from '../../../images/preferences.svg';

import { savePageVersion } from '../../../action/pageVersion.js';
import { createNavigationContent } from '../../../action/navigation.js';
import {
  convertEditorsToRaw,
  setPageTitle,
  togglePreviewMode,
  autoSaveUnsavedChanges,
  savePageSnapshot,
  setPreviewMode } from '../../../action/page.js';
import * as mainToolbarActions from '../../../action/mainToolbar.js';

export const ONE_SEC = 1000;
export const TEN_SEC = 10 * ONE_SEC;
export const TWO_MIN = 120 * ONE_SEC;

require('./mainToolbar.scss');

class MainToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showWarningForNotAllowingEditOnMobileView: false };
    if (window.screen.width <= 786 && this.props.preview === false) {
      this.props.setPreviewMode(true);
    }
  }

  componentDidMount() {
    this.autoSaveTimeout = setInterval(() => {
      if (
        this.props.name && this.props.canEdit && this.props.unsavedChanges &&
        this.props.editorAutoSave && this.props.projectID() && !this.props.isOldVersionShowing
      ) {
        this.props.autoSaveUnsavedChanges();
        this.props.createNavigationContent(this.props.layout);
        this.props.savePage();
      }
    }, TEN_SEC);
    this.autoSavePageVersion = setInterval(() => {
      if (
        this.props.name && this.props.canEdit && !this.props.isPageVersionSaved &&
        this.props.projectID() && !this.props.isOldVersionShowing
      ) {
        this.savePageVersion();
      }
    }, TWO_MIN);
    // window.addEventListener('beforeunload', this.saveSnapshot);
  }

  componentWillUnmount() {
    clearTimeout(this.autoSaveTimeout);
    clearTimeout(this.autoSavePageVersion);
    // window.removeEventListener('beforeunload', this.saveSnapshot);
  }

  togglePreviewMode = () => {
    if (window.screen.width > 786) {
      this.props.togglePreviewMode();
    } else {
      this.setState({ showWarningForNotAllowingEditOnMobileView: true });
    }
  }

  savePageVersion = () => {
    this.props.savePageVersion(
      this.props.parentId,
      this.props.id,
      this.props.title,
      this.props.heading,
      this.props.snapshotPath,
      this.props.description,
      this.props.editors,
      this.props.editorIndex,
      this.props.layout,
      this.props.workspace,
      this.props.isPublished,
      this.props.tags,
    );
  }

  setPageTitle = (event) => {
    document.title = event.target.value;
    this.props.setPageTitle(event);
  }

  saveSnapshotWithPage = () => {
    this.props.savePage();
    this.saveSnapshot();
  }

  saveSnapshot = () => {
    if (this.props.projectID()) {
      savePageSnapshot(this.props.projectID(), false);
    }
  }

  sharePebl = () => {
    this.props.setShareURL(window.location.href);
    this.props.viewShareModal();
  }

  focusOnButton(event) {
    event.target.focus();
  }

  render() {
    const prefButtonClassName = classNames('main-toolbar__pref', {
      'main-toolbar__pref--open': this.props.isPreferencesPanelOpen
    });
    let saveButtonText = 'Remix';
    if (this.props.name) { // user is logged in
      if (this.props.canEdit) { // it is users sketch
        if (this.props.unsavedChanges) { // there are some unsaved changes
          saveButtonText = 'Save';
        } else { // there are no unsaved changes
          if (this.props.projectID()) { // eslint-disable-line
            // it is not a new sketch
            saveButtonText = <CheckSVG alt="check svg" />;
          } else { // it is a new sketch
            saveButtonText = 'Save';
          }
        }
      } else { // it is not users sketch
        saveButtonText = 'Remix';
      }
    } else { // user is not logged in
      if (this.props.projectID()) { // eslint-disable-line
        // it is not a new sketch
        saveButtonText = 'Remix';
      } else { // it is a new sketch
        saveButtonText = 'Save';
      }
    }

    const fileDropDownButtonClassName = classNames({
      'upper-toolbar__dropdown': !this.props.isFileDropdownOpen,
      'upper-toolbar__dropdown upper-toolbar__dropdown-open': this.props.isFileDropdownOpen
    });
    const helpDropDownButtonClassName = classNames({
      'upper-toolbar__dropdown': !this.props.isHelpDropdownOpen,
      'upper-toolbar__dropdown upper-toolbar__dropdown-open': this.props.isHelpDropdownOpen
    });

    return (
      <div className="main-toolbar__container">
        <div className="main-toolbar">
          <div className="main-toolbar__div-left">


            <a
              className="logo_toolbar"
              href="https://www.peblio.co/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ToolbarLogo alt="logo in toolbar" />
            </a>
            <div id="mobile-navigation">
              <NavigationHamburger
                viewPagesModal={this.props.viewPagesModal}
                toggleFileDropdown={this.props.toggleFileDropdown}
                viewExamplesModal={this.props.viewExamplesModal}
                sharePebl={this.sharePebl}
                isUserLoggedIn={this.props.name}
              />
            </div>
            <div
              className="file-modal__container"
              role="presentation"
              onClick={(e) => {
                this.focusOnButton(e);
              }}
              onBlur={() => {
                setTimeout(() => {
                  if (this.props.isFileDropdownOpen) {
                    this.props.toggleFileDropdown();
                  }
                }, 50);
              }}
            >
              <button
                className={fileDropDownButtonClassName}
                onMouseDown={this.props.toggleFileDropdown}
                onKeyDown={this.props.toggleFileDropdown}
                data-test="toggle-file-dropdown"
              >
                File
              </button>
              {this.props.isFileDropdownOpen && (
                <FileMenu
                  savePage={this.props.savePage}
                />
              )}
            </div>

            <div
              className="file-modal__container"
              role="presentation"
              onClick={(e) => {
                this.focusOnButton(e);
              }}
              onBlur={() => {
                setTimeout(() => {
                  if (this.props.isHelpDropdownOpen) {
                    this.props.toggleHelpDropdown();
                  }
                }, 50);
              }}
            >
              <button
                className={helpDropDownButtonClassName}
                onMouseDown={this.props.toggleHelpDropdown}
                onKeyDown={this.props.toggleHelpDropdown}
                data-test="toggle-help-dropdown"
              >
                Help
              </button>
              {this.props.isHelpDropdownOpen && (
                <HelpMenu />
              )}
            </div>

          </div>
          <input
            className="main-toolbar__title main-toolbar__div-center"
            placeholder="Title"
            type="text"
            value={this.props.pageTitle}
            onChange={this.setPageTitle}
            readOnly={this.props.preview}
            data-test="main-toolbar__title"
          />
          {this.props.preview || (
            <div className="main-toolbar__pencil-container">
              <Tooltip
                content="Page Title"
              >
                <span
                  className="fa fa-pencil-alt main-toolbar__search-icon"
                >
                </span>
              </Tooltip>
            </div>
          )}
          <div className="main-toolbar__div-right">
            <div className="main-toolbar__div-right-inside">
              <Modal
                size="large"
                isOpen={this.state.showWarningForNotAllowingEditOnMobileView}
                closeModal={() => this.setState({ showWarningForNotAllowingEditOnMobileView: false })}
              >
                <EditAccessDisabledOnMobile closeEditAccessWarningPageModal={
                  () => this.setState({ showWarningForNotAllowingEditOnMobileView: false })}
                />
              </Modal>
              <span className="main-toolbar__preview-title">Edit Mode</span>

              <label
                className="main-toolbar__preview"
                htmlFor="main-toolbar__checkbox"
              >
                <input
                  id="main-toolbar__checkbox"
                  onChange={this.togglePreviewMode}
                  type="checkbox"
                  checked={this.props.preview}
                  data-test="main-toolbar__edit-mode-toggle"
                  disabled={this.props.isOldVersionShowing}
                />
                <div className={`main-toolbar__slider ${this.props.preview}`}></div>
              </label>
              <button
                className="main-toolbar__save"
                onClick={saveButtonText === 'Remix' ? this.props.remixPage : this.saveSnapshotWithPage}
                data-test="main-toolbar__save-button"
              >
                {saveButtonText}
              </button>
              <div className="main-toolbar__spacer"></div>
              <button
                className="main-toolbar__button main-toolbar__save_button"
                onClick={this.sharePebl}
                data-test="main-toolbar__share-button"
              >
                Share
              </button>
              <div className="main-toolbar__spacer"></div>
              <div className="main-toolbar__pref-container">
                <Tooltip content="Settings">
                  <button
                    className="main-toolbar__button "
                    onMouseDown={this.props.togglePreferencesPanel}
                    data-test="main-toolbar__preferences-button"
                  >
                    <PreferencesSVG
                      className={classNames(prefButtonClassName)}
                      alt="open preferences"
                    />
                  </button>
                </Tooltip>
                {this.props.isPreferencesPanelOpen && <Preferences />}
              </div>
              <div className="main-toolbar__spacer"></div>
              <UserAccount
                container='app'
                location={this.props.location}
              />

            </div>
          </div>
        </div>
        {(this.props.preview || this.props.isFullScreenMode) || (
          <InsertToolbar />
        )}

      </div>
    );
  }
}

MainToolbar.propTypes = {
  autoSaveUnsavedChanges: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  createNavigationContent: PropTypes.func.isRequired,
  editorAutoSave: PropTypes.bool.isRequired,
  isFileDropdownOpen: PropTypes.bool.isRequired,
  isFullScreenMode: PropTypes.bool.isRequired,
  isHelpDropdownOpen: PropTypes.bool.isRequired,
  isPageVersionSaved: PropTypes.bool.isRequired,
  isPreferencesPanelOpen: PropTypes.bool.isRequired,
  layout: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  pageTitle: PropTypes.string.isRequired,
  preview: PropTypes.bool.isRequired,
  projectID: PropTypes.func.isRequired,
  setPageTitle: PropTypes.func.isRequired,
  savePage: PropTypes.func.isRequired,
  remixPage: PropTypes.func.isRequired,
  setShareURL: PropTypes.func.isRequired,
  toggleHelpDropdown: PropTypes.func.isRequired,
  toggleFileDropdown: PropTypes.func.isRequired,
  togglePreviewMode: PropTypes.func.isRequired,
  togglePreferencesPanel: PropTypes.func.isRequired,
  unsavedChanges: PropTypes.bool.isRequired,
  viewShareModal: PropTypes.func.isRequired,
  viewExamplesModal: PropTypes.func.isRequired,

  parentId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  snapshotPath: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  editors: PropTypes.shape({}).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  editorIndex: PropTypes.number.isRequired,
  workspace: PropTypes.shape({}).isRequired,
  isPublished: PropTypes.bool.isRequired,
  savePageVersion: PropTypes.func.isRequired,
  isOldVersionShowing: PropTypes.bool.isRequired,
  setPreviewMode: PropTypes.func.isRequired,
  viewPagesModal: PropTypes.func.isRequired,
};


function mapStateToProps(state) {
  return {
    canEdit: state.user.canEdit,
    isFileDropdownOpen: state.mainToolbar.isFileDropdownOpen,
    isFullScreenMode: state.editorsReducer.isFullScreenMode,
    isHelpDropdownOpen: state.mainToolbar.isHelpDropdownOpen,
    isOldVersionShowing: state.pageVersion.isOldVersionShowing,
    isPreferencesPanelOpen: state.mainToolbar.isPreferencesPanelOpen,
    layout: state.page.layout,
    name: state.user.name,
    pageTitle: state.page.pageTitle,
    preview: state.page.preview,
    unsavedChanges: state.page.unsavedChanges,
    editorAutoSave: state.preferences.editorAutoSave,

    isPageVersionSaved: state.pageVersion.isPageVersionSaved,

    parentId: state.page.parentId,
    id: state.page.id,
    title: state.page.pageTitle,
    heading: state.page.pageHeading,
    snapshotPath: '',
    description: state.page.description,
    editors: state.editorsReducer.editors,
    editorIndex: state.editorsReducer.editorIndex,
    workspace: state.workspace.workspace,
    isPublished: state.page.isPublished,
    tags: state.page.tags,
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({
  createNavigationContent,
  setPageTitle,
  togglePreviewMode,
  autoSaveUnsavedChanges,
  convertEditorsToRaw,
  savePageVersion,
  setPreviewMode,
  ...mainToolbarActions,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainToolbar);
