import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// components
import InputField from '../../InputField/InputField';
import IconButton from '../../IconButton/IconButton';
import Dropdown from '../../Dropdown/Dropdown';

// actions
import {
  setDocumentSort,
  setDocumentView,
  searchByTitle,
  clearSearchByTitle,
} from '../../../action/dashboard';

import {
  createFolder,
  createPage
} from '../../../action/page.js';

// logos
import Block from '../../../images/block.svg';
import Line from '../../../images/stack.svg';
import ClearFilter from '../../../images/clearFilter.svg';

import './filters.scss';

const Filters = (props) => {
  const [search, setSearch] = useState('');

  const handleSearchByTitle = (e) => {
    if (e.target.value === '') {
      props.clearSearchByTitle();
      return;
    }
    props.searchByTitle(e.target.value);
  };

  const handleViewChange = () => {
    if (props.documentView === 'line') {
      props.setDocumentView('block');
    } else {
      props.setDocumentView('line');
    }
  };

  const handleClearFilter = () => {
    setSearch(() => '');
    props.clearSearchByTitle();
  };


  // eslint-disable-next-line no-shadow
  const createFolder = () => {
    const folderId = props.selectedFolderIds[props.selectedFolderIds.length - 1];
    props.createFolder('New Folder', folderId);
  };

  // eslint-disable-next-line no-shadow
  const createPage = () => {
    let folderId = null;
    if (props.selectedFolderIds.length > 0) {
      folderId = props.selectedFolderIds[props.selectedFolderIds.length - 1];
    }
    props.createPage('New Page', folderId);
  };

  return (
    <div className="documents__filters">
      <div
        className="documents__filters__label"
      >
        Search
      </div>
      <InputField
        state={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearchByTitle(e);
        }}
        placeholder="File name"
        containerWidth='370px'
        style={{
          background: '#fff',
        }}
      />
      <Dropdown
        placeholder="Add New"
        className="btn"
        style={{
          width: '146px',
        }}
        options={[
          {
            name: 'Folder',
            value: 'folder',
            onClick: (e) => { createFolder(e); }
          }, {
            name: 'Page',
            value: 'page',
            onClick: (e) => { createPage(e); }
          }
        ]}
      />
      <div
        className="documents__filters__label"
        style={{ marginLeft: 'auto' }}
      >
        Arrange By
      </div>
      <Dropdown
        placeholder="Title"
        style={{
          width: '136px',
        }}
        options={[
          {
            name: 'Title',
            value: 'title',
            onClick: () => { props.setDocumentSort('title'); }
          }, {
            name: 'Updated At',
            value: 'update',
            onClick: () => { props.setDocumentSort('-updatedAt'); }
          }
        ]}
      />
      <IconButton
        icon={<ClearFilter />}
        onClick={handleClearFilter}
        id='clear-filter'
      />
      <IconButton
        icon={props.documentView === 'line' ? <Block /> : <Line />}
        onClick={handleViewChange}
      />
    </div>
  );
};

Filters.propTypes = {
  setDocumentView: PropTypes.func.isRequired,
  searchByTitle: PropTypes.func.isRequired,
  clearSearchByTitle: PropTypes.func.isRequired,
  setDocumentSort: PropTypes.func.isRequired,
  createFolder: PropTypes.func.isRequired,
  createPage: PropTypes.func.isRequired,
  documentView: PropTypes.string.isRequired,
  selectedFolderIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  documentView: state.dashboard.documentView,
  selectedFolderIds: state.page.selectedFolderIds,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setDocumentView,
  searchByTitle,
  setDocumentSort,
  clearSearchByTitle,
  createFolder,
  createPage
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
