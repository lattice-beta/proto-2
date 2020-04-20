import React from 'react';
import PropTypes from 'prop-types';

require('./editAccessDisabledOnMobile.scss');

export default class EditAccessDisabledOnMobile extends React.Component {
  getMessage() {
    return (
      <div>
        <div className="editAccessWarning-modal__sub-title">
          It looks like you are trying to edit a page on a Mobile device.
        </div>
        <div className="editAccessWarning-modal__footnote">
          Please try doing this on a Desktop
        </div>
      </div>
    );
  }


  render() {
    return (
      <div className="editAccessWarning-modal__content">
        <h1 className="editAccessWarning-modal__sub-title">
          {this.getMessage()}
        </h1>
        <button
          className="editAccessWarning-modal__button"
          onClick={this.props.closeEditAccessWarningPageModal}
        >
          OK
        </button>
      </div>
    );
  }
}

EditAccessDisabledOnMobile.propTypes = {
  closeEditAccessWarningPageModal: PropTypes.func.isRequired,
};
