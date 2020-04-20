import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeForkPrompt } from '../../../../action/mainToolbar.js';
import { setUserBrowsingPebl } from '../../../../action/user.js';

require('./forkPrompt.scss');

class ForkPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false
    };
  }

  setForkPromptPreference=(event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ isChecked: value });
    if (value) {
      localStorage.setItem(process.env.LOCALSTORAGE_FORK_PROMPT, 'suppress');
    } else {
      localStorage.setItem(process.env.LOCALSTORAGE_FORK_PROMPT, 'show');
    }
  }

  render() {
    return (
      <div className="fork-prompt__content">
        <div>
          <h2 className="fork-prompt__title">
            Would you like to remix the page?
          </h2>
          <p className="fork-prompt__subtitle">
            Remixing this page will save a copy to your account and allow you to save your changes.
          </p>
          <div
            className="fork-prompt__button-container"
          >
            <button
              className="fork-prompt__button"
              onClick={() => {
                this.props.closeForkPrompt();
                this.props.setUserBrowsingPebl();
              }}
            >
              Just Browsing
            </button>
            <button
              className="fork-prompt__button"
              onClick={() => {
                this.props.closeForkPrompt();
                this.props.savePage();
              }}
            >
              Remix
            </button>
          </div>
          <div className="fork-prompt__checkbox-container">
            <input
              id="fork-prompt__dont-ask"
              name="fork-prompt__dont-ask"
              type="checkbox"
              className="fork-prompt__checkbox"
              onChange={(e) => { this.setForkPromptPreference(e); }}
              checked={this.state.isChecked}
            />
            <label htmlFor="fork-prompt__dont-ask">Don‘t ask me again</label>
          </div>
        </div>
      </div>
    );
  }
}

ForkPrompt.propTypes = {
  closeForkPrompt: PropTypes.func.isRequired,
  savePage: PropTypes.func.isRequired,
  setUserBrowsingPebl: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    name: state.user.name,
    rgl: state.page.rgl,
    id: state.page.id
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({
  closeForkPrompt,
  setUserBrowsingPebl
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ForkPrompt);
