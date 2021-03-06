import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BreadCrumb from './BreadCrumb';

class BreadCrumbs extends Component {
  render() {
    const { folders, selectedFolderIds } = this.props;
    const homeFolder = {
      title: 'Home'
    };
    const breadCrumbFolders = [...selectedFolderIds];
    breadCrumbFolders.pop();
    return (
      <ul className="profile-breadcrumbs">
        <BreadCrumb
          folder={homeFolder}
          container={this.props.container}
          profileName={this.props.profileName}
          folderDepth={this.props.folderDepth}
          jumpToFolderByShortId={this.props.jumpToFolderByShortId}
          clearSelectedFolders={this.props.clearSelectedFolders}
        />
        {breadCrumbFolders.map((folderId) => {
          const folder = folders.byId[folderId];
          return (
            <BreadCrumb
              folder={folder}
              container={this.props.container}
              profileName={this.props.profileName}
              folderDepth={this.props.folderDepth}
              jumpToFolderByShortId={this.props.jumpToFolderByShortId}
              clearSelectedFolders={this.props.clearSelectedFolders}
            />
          );
        })
        }
      </ul>
    );
  }
}

BreadCrumbs.propTypes = {
  clearSelectedFolders: PropTypes.func.isRequired,
  container: PropTypes.string.isRequired,
  folder: PropTypes.shape({}).isRequired,
  folders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  folderDepth: PropTypes.number.isRequired,
  jumpToFolderByShortId: PropTypes.func.isRequired,
  profileName: PropTypes.string.isRequired,
  selectedFolderIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BreadCrumbs;
