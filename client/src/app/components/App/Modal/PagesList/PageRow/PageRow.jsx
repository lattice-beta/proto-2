import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';

import ItemTypes from '../itemTypes';
import formatDate from '../../../../../utils/format-date';
import { trashPage, duplicatePage, viewPage } from '../../../../../action/page';
import DeleteIcon from '../../../../../images/trash.svg';
import DuplicateIcon from '../../../../../images/duplicate.svg';
import { SCREEN_SIZE_786 } from '../../../../../constants/screenSizeConstants';

const pageSource = {
  beginDrag(props) {
    return { pageId: props.page._id };
  }
};

function collect(_connect, monitor) {
  return {
    connectDragSource: _connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class PageRow extends Component {
  trashPage = (e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to trash this file?')) { // eslint-disable-line no-restricted-globals
      this.props.trashPage(this.props.page._id);
    }
  }

  duplicatePage = (e) => {
    e.stopPropagation();
    const {
      id,
      folder
    } = this.props.page;

    this.props.duplicatePage(id, folder);
  }

  handleClick = (e) => {
    e.stopPropagation();
    if (this.props.isSelected) {
      this.redirectToPage();
    } else {
      this.props.viewPage(this.props.page._id);
    }
  }

  handleDoubleClick = (e) => {
    e.stopPropagation();
    this.redirectToPage();
  }

  redirectToPage = () => {
    // page.id is a shortid that is NOT the same thing as page._id
    window.open(`/pebl/${this.props.page.id}`, '_blank');
  }

  render() {
    const { connectDragSource, isDragging, isSelected, page } = this.props;
    const colClassName = classNames('pages__col', {
      'pages__col--selected-page': isSelected,
      'pages__col--dragging': isDragging
    });
    return connectDragSource(
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <tr className="pages__row" onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>
        <td className={classNames(colClassName, 'pages__col_title')} data-test="page-title">
          {page.title}
        </td>
        {window.screen.width > SCREEN_SIZE_786 && (
          <React.Fragment>
            <td className={colClassName}>{formatDate(page.createdAt)}</td>
            <td className={colClassName}>{formatDate(page.updatedAt)}</td>
          </React.Fragment>
        )}
        <td className={colClassName}>
          <button
            className="pages__icon"
            onClick={this.trashPage}
            data-test="delete-pebl"
          >
            <DeleteIcon alt="delete page" />
          </button>
          <button
            className="pages__icon"
            onClick={this.duplicatePage}
            data-test="duplicate-pebl"
          >
            <DuplicateIcon alt="duplicate page" />
          </button>
        </td>
      </tr>
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    );
  }
}

PageRow.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  trashPage: PropTypes.func.isRequired,
  duplicatePage: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  page: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    editorIndex: PropTypes.number,
    editors: PropTypes.shape({}),
    folder: PropTypes.shape({}),
    layout: PropTypes.arrayOf(PropTypes.shape({})),
    title: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    snapshotPath: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    updatedAt: PropTypes.instanceOf(Date)
  }).isRequired,
  viewPage: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isSelected: state.page.selectedPageId === ownProps.page._id
});

const mapDispatchToProps = dispatch => bindActionCreators({
  trashPage,
  duplicatePage,
  viewPage
}, dispatch);

const DraggablePageRow = DragSource(ItemTypes.PAGE, pageSource, collect)(PageRow);

export default connect(mapStateToProps, mapDispatchToProps)(DraggablePageRow);
