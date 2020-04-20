import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ComponentFolder } from './Folder';

class Folders extends Component {
  render() {
    const documentViewCLass = classNames('profile-folders__list', {
      'document-line': (this.props.documentView === 'line'),
      'document-block': (this.props.documentView === 'block')
    });
    return (
      <section className="profile-folders__container">
        <ul className={classNames(documentViewCLass)}>
          <div className="profile-folders__li-heading-container">
            <h4 className="profile-folders__li-heading">
              name
            </h4>
            <h4 className="profile-folders__li-heading">
              Last Modified
            </h4>
            <h4 className="profile-folders__li-heading">
              # Of files
            </h4>
          </div>
          {this.props.folders.map((folder, key) => (
            <ComponentFolder
              folder={folder}
              keyId={key}
              container={this.props.container}
              deleteFolder={this.props.deleteFolder}
              jumpToFolderByShortId={this.props.jumpToFolderByShortId}
              setShareURL={this.props.setShareURL}
              viewShareModal={this.props.viewShareModal}
              renameFolder={this.props.renameFolder}
              profileName={this.props.profileName}
            />

          ))}
        </ul>
      </section>

    );
  }
}

Folders.propTypes = {
  container: PropTypes.string.isRequired,
  deleteFolder: PropTypes.func.isRequired,
  documentView: PropTypes.string.isRequired,
  folders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  profileName: PropTypes.string.isRequired,
  jumpToFolderByShortId: PropTypes.string.isRequired,
  renameFolder: PropTypes.func.isRequired,
  setShareURL: PropTypes.func.isRequired,
  viewShareModal: PropTypes.func.isRequired,
};

export default Folders;
