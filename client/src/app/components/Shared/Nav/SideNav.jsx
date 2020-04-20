import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Progress from 'react-progressbar';
import {
  setDashboardView,
  setDocumentSort,
  setDocumentView,
  searchByTitle,
  clearSearchByTitle,
  toggleAddNewMenu,
  loadMemoryConsumed
} from '../../../action/dashboard.js';
import {
  createFolder,
  createPage
} from '../../../action/page.js';
import PlusIcon from '../../../images/plus.svg';

import './nav.scss';


class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.titleSearch = {};
  }

  componentWillMount() {
    this.props.loadMemoryConsumed();
    if (window.location.pathname.includes('profile')) {
      this.props.setDashboardView('profile');
    }
  }

  renderListItem=(displayText, viewName) => {
    const isCurrentDashboardView = this.props.dashboardView === viewName;
    return (
      <li
        className={`dashboard-side-nav__list-item
          ${(isCurrentDashboardView) ? 'dashboard-side-nav__list-item--selected' : ''}`}
      >
        <button
          className="dashboard-side-nav__button"
          onClick={() => { this.props.setDashboardView(viewName); }}
        >
          {displayText}
        </button>
      </li>
    );
  }

  createFolder = (e) => {
    e.preventDefault();
    const folderId = this.props.selectedFolderIds[this.props.selectedFolderIds.length - 1];
    e.stopPropagation();
    this.props.createFolder('New Folder', folderId);
  }

  createPage = (e) => {
    e.preventDefault();
    let folderId = null;
    if (this.props.selectedFolderIds.length > 0) {
      folderId = this.props.selectedFolderIds[this.props.selectedFolderIds.length - 1];
    }
    e.stopPropagation();
    this.props.createPage('New Page', folderId);
  }

  setDocumentSort = (e) => {
    this.props.setDocumentSort(e.target.value);
  }

  searchByTitle = (e) => {
    if (e.target.value === '') {
      this.props.clearSearchByTitle();
      return;
    }
    this.props.searchByTitle(e.target.value);
  }

  clearSearchText = () => {
    this.titleSearch.value = '';
    this.props.clearSearchByTitle();
  }

  getMemoryConsumedMessage = () => {
    const memoryConsumedInMegaBytes = Math.ceil(this.props.memoryConsumed / 1000000);
    return (
      <div className="dashboard-side-nav__memory">
        <h1 className="dashboard-side-nav__memory-heading">
          Storage
        </h1>
        <Progress completed={memoryConsumedInMegaBytes * 100 / 1024} />
        <h2 className="dashboard-side-nav__memory-details">
          {memoryConsumedInMegaBytes}
          {'MB out of 1024 MB'}
        </h2>
      </div>
    );
  };

  render() {
    return (
      <div className="dashboard-side-nav__container">
        <div className="dashboard-nav__new-container">
          <button
            className="dashboard-nav__add-button"
            onMouseDown={this.props.toggleAddNewMenu}
            onKeyDown={this.props.toggleAddNewMenu}
            onBlur={() => {
              setTimeout(() => {
                if (this.props.isAddNewMenuOpen) {
                  this.props.toggleAddNewMenu();
                }
              }, 50);
            }}
          >
            <PlusIcon />
            {' '}
            Add New
          </button>
          {this.props.isAddNewMenuOpen && (
            <ul className="dashboard-nav__sub-button-container">
              <button
                className="dashboard-nav__add-sub-button"
                onMouseDown={this.createPage}
                onKeyDown={this.createPage}
              >
                File
              </button>
              <button
                className="dashboard-nav__add-sub-button"
                onMouseDown={this.createFolder}
                onKeyDown={this.createFolder}
              >
                Folder
              </button>
            </ul>
          )}
        </div>
        <ul className="dashboard-side-nav__list">
          {this.renderListItem('Documents', 'documents')}
          {this.renderListItem('Account', 'account')}
          {this.renderListItem('Trash', 'trash')}
          {this.props.userType === 'student' || this.renderListItem('Profile', 'profile')}
        </ul>
        {(this.props.dashboardView === 'profile') && (
          <a
            className="dashboard-nav__profile-link"
            target="_blank"
            rel="noopener noreferrer"
            href={`/profile/${this.props.name}`}
          >
            View Profile
          </a>
        )}
        {this.getMemoryConsumedMessage()}
      </div>
    );
  }
}

SideNav.propTypes = {
  createFolder: PropTypes.func.isRequired,
  createPage: PropTypes.func.isRequired,
  dashboardView: PropTypes.string.isRequired,
  isAddNewMenuOpen: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  setDocumentSort: PropTypes.func.isRequired,
  setDashboardView: PropTypes.func.isRequired,
  selectedFolderIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleAddNewMenu: PropTypes.func.isRequired,
  searchByTitle: PropTypes.func.isRequired,
  clearSearchByTitle: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
  loadMemoryConsumed: PropTypes.func.isRequired,
  memoryConsumed: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    name: state.user.name,
    dashboardView: state.dashboard.dashboardView,
    parentFolderId: state.dashboard.parentFolderId,
    isAddNewMenuOpen: state.dashboard.isAddNewMenuOpen,
    selectedFolderIds: state.page.selectedFolderIds,
    userType: state.user.type,
    memoryConsumed: state.dashboard.memoryConsumed,
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  createFolder,
  createPage,
  setDashboardView,
  setDocumentView,
  setDocumentSort,
  searchByTitle,
  clearSearchByTitle,
  toggleAddNewMenu,
  loadMemoryConsumed
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
