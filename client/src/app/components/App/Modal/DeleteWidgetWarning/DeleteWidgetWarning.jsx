import React from 'react';
import PropTypes from 'prop-types';

require('./deleteWidgetWarning.scss');

export default class DeleteWidgetWarning extends React.Component {
  deleteWidgetConfirm = () => {
    this.props.deleteWidget();
    this.props.closeModal();
  }

  render() {
    return (
      <div className="delete-widget-warning-modal__content">
        <h1 className="delete-widget-warning-modal__sub-title">
          <div>
            <div className="delete-widget-warning-modal__sub-title">
              Are you sure you want to delete the widget?
            </div>
            <div className="delete-widget-warning-modal__footnote">
              This would delete the widget from your page permanently
            </div>
          </div>
        </h1>
        <div className="delete-widget-warning-modal__buttons-holder">
          <button
            className="delete-widget-warning-modal__button"
            data-test="widget__confirm"
            onClick={this.deleteWidgetConfirm}
          >
            Delete
          </button>
          <button
            className="delete-widget-warning-modal__button"
            data-test="widget__cancel"
            onClick={this.props.closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

DeleteWidgetWarning.propTypes = {
  deleteWidget: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
};
