import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import DeleteIcon from '../../../images/trash.svg';
import RestoreIcon from '../../../images/restore.svg';
import {
  emptyTrash,
  setTrashPages,
  restoreTrashedPage,
  deletePage
} from '../../../action/dashboard.js';

import './trash.scss';

class Trash extends React.Component {
  componentWillMount() {
    this.loadTrashedPages();
  }

  loadTrashedPages = () => {
    this.props.setTrashPages();
  }

  restorePage = (id) => {
    this.props.restoreTrashedPage(id);
  }

  deletePage = (id) => {
    if (confirm('Are you sure you want to permanently delete this file?')) { // eslint-disable-line no-restricted-globals
      this.props.deletePage(id);
    }
  }

  emptyTrash = () => {
    if (confirm('Are you sure you want to empty the trash?')) { // eslint-disable-line no-restricted-globals
      this.props.emptyTrash();
    }
  }

  renderTrashPages=() => {
    const pages = [];
    this.props.trashPages.forEach((page) => {
      pages.push(
        <li className="profile-pebl__container" key={page.id}>
          <a
            className="profile-pebl__link profile-pebl__overlay"
            target="_blank"
            rel="noopener noreferrer"
            href={`/pebl/${page.id}`}
          >
            <div>
              <h1
                className="profile-pebl__overlay-title"
              >
                {page.title}
              </h1>
              <p
                className="profile-pebl__overlay-desc"
              >
                {page.description}
              </p>
            </div>
            <p
              className="profile-pebl__overlay-author"
            >
              {page.userName}
            </p>
          </a>

          <img
            src={page.snapshotPath}
            className="profile-pebl__image"
            alt="snapshot of the pebl"
          />
          <h1
            className="profile-pebl__title"
          >
            {page.title}
          </h1>
          <div className="profile-pebl__info">
            <p
              className="profile-pebl__sub-info"
            >
              {moment(page.updatedAt).format('DD/MMM/YYYY')}
            </p>
            <div
              className="profile-pebl__sub-info"
            >
              <button
                className="pages__icon"
                onClick={() => { this.deletePage(page._id); }}
              >
                <DeleteIcon alt="delete page" />
              </button>
              <button
                className="pages__icon"
                onClick={() => { this.restorePage(page._id); }}
              >
                <RestoreIcon alt="restore page" />
              </button>
            </div>
          </div>
        </li>

      );
    });
    return (pages);
  }

  render() {
    const documentViewCLass = classNames('profile-pebl__list', {
      'document-line': (this.props.documentView === 'line'),
      'document-block': (this.props.documentView === 'block')
    });
    return (
      <div className="trash__container">
        <div className="trash__sub-container">
          <h2 className="profile-pebls__sub-heading">files</h2>
          <button
            className="trash__button"
            onClick={this.emptyTrash}
          >
            Empty trash
          </button>
        </div>
        <ul className={classNames(documentViewCLass)}>
          <div className="profile-pebl__li-heading-container">
            <h4 className="profile-pebl__li-heading">
              name
            </h4>
            <h4 className="profile-pebl__li-heading">
              Last Modified
            </h4>
          </div>
          {this.renderTrashPages()}
        </ul>
      </div>


    );
  }
}


function mapStateToProps(state) {
  return {
    trashPages: state.dashboard.trashPages,
    documentView: state.dashboard.documentView
  };
}

Trash.propTypes = {
  deletePage: PropTypes.func.isRequired,
  documentView: PropTypes.func.isRequired,
  emptyTrash: PropTypes.func.isRequired,
  restoreTrashedPage: PropTypes.func.isRequired,
  setTrashPages: PropTypes.func.isRequired,
  trashPages: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};


const mapDispatchToProps = dispatch => bindActionCreators({
  deletePage,
  emptyTrash,
  setTrashPages,
  restoreTrashedPage
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Trash);
