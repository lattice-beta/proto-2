import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Tags from '../../Canvas/Tags/Tags.jsx';
import {
  publishPage,
  setPageHeading,
  setPageDescription
} from '../../../../action/page.js';

require('./addDescription.scss');

const descriptionPlaceholder = 'Add a description here. This description will be added to our home page, where your work can be discovered by the Peblio community'; /* eslint-disable-line */


class AddDescription extends React.Component {
  renderDescriptionButton() {
    if (this.props.userType === 'student' && !this.props.isPeblPublished) {
      return 'Publish';
    }
    return 'Save';
  }

  render() {
    return (
      <div className="description-modal__content">
        <h1 className="description-modal__title">
          Pebl description
        </h1>
        <input
          type="text"
          className='description-modal__input'
          placeholder="Title"
          value={this.props.pageHeading}
          onChange={this.props.setPageHeading}
        />
        <textarea
          type="text"
          className='description-modal__input description-modal__desc-input'
          placeholder={descriptionPlaceholder}
          value={this.props.description}
          onChange={this.props.setPageDescription}
          rows="3"
        />
        <Tags
          preview={false}
          container="modal"
        />
        <button
          className="description-modal__button"
          onClick={() => {
            this.props.publishPage();
            this.props.closeModal();
          }}
        >
          {this.renderDescriptionButton()}
        </button>
      </div>
    );
  }
}

AddDescription.propTypes = {
  closeModal: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  isPeblPublished: PropTypes.bool.isRequired,
  pageHeading: PropTypes.string.isRequired,
  publishPage: PropTypes.func.isRequired,
  setPageHeading: PropTypes.func.isRequired,
  setPageDescription: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    description: state.page.description,
    isPeblPublished: state.page.isPublished,
    pageHeading: state.page.pageHeading,
    userType: state.user.type
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({
  publishPage,
  setPageDescription,
  setPageHeading
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddDescription);
