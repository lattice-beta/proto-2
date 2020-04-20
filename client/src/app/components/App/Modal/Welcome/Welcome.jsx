import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as mainToolbarActions from '../../../../action/mainToolbar.js';
import * as WelcomeText from '../../../../constants/welcomeConstants.js';

require('./welcome.scss');

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenNumber: 0,
      title: [
        '',
        WelcomeText.WELCOME_TOUR_TITLE_1,
        WelcomeText.WELCOME_TOUR_TITLE_2,
        WelcomeText.WELCOME_TOUR_TITLE_3,
      ],
      content: [
        '',
        WelcomeText.WELCOME_TOUR_CONTENT_1,
        WelcomeText.WELCOME_TOUR_CONTENT_2,
        WelcomeText.WELCOME_TOUR_CONTENT_3,
      ],
      images: [
        '',
        WelcomeText.WELCOME_IMAGE_LINK_1,
        WelcomeText.WELCOME_IMAGE_LINK_2,
        WelcomeText.WELCOME_IMAGE_LINK_3,
      ]
    };
  }

  increaseScreenNumber =() => {
    this.setState(prevState => ({
      screenNumber: prevState.screenNumber + 1
    }));
  }

  resetScreenNumber =() => {
    this.setState({
      screenNumber: 0
    });
  }

  startTour = () => {
    window.open('https://hlp.sh/t/Z1zN8Bp/nQYCLe66CTj');
    this.props.closeWelcomeModal();
  }

  render() {
    const containerClass = classNames('welcome__container', {
      'welcome__green-back': (this.state.screenNumber === 1 || this.state.screenNumber === 4),
      'welcome__blue-back': (this.state.screenNumber === 0 || this.state.screenNumber === 2),
      'welcome__red-back': (this.state.screenNumber === 3),
    });
    const buttonClass = classNames('welcome__button', {
      'welcome__green-button': (this.state.screenNumber === 1 || this.state.screenNumber === 4),
      'welcome__blue-button': (this.state.screenNumber === 0 || this.state.screenNumber === 2),
      'welcome__red-button': (this.state.screenNumber === 3),
    });
    return (
      <section className={classNames(containerClass)}>
        {(this.state.screenNumber === 0) && (
          <div className="welcome__sub-container-horiz">
            <h1 className="welcome__title">
              Welcome To Peblio!
            </h1>
            <h2 className="welcome__subtitle">
              The easiest way to write about code
            </h2>
            <p className="welcome__text">
              Take a quick tour of our features
            </p>
            <button
              className="welcome__button welcome__blue-button"
              onClick={this.increaseScreenNumber}
            >
              {'Let\'s Go!'}
            </button>
            <button
              className="welcome__button welcome__blue-button"
              onClick={this.props.closeWelcomeModal}
            >
              Skip
            </button>
            <p className="welcome__text">
              {'You can always open this your with Help > Tutorial in the toolbar'}
            </p>
          </div>
        )}
        {(this.state.screenNumber >= 1 && this.state.screenNumber < 4) && (
          <div className="welcome__sub-container">
            <div className="welcome__left">
              <h1 className="welcome__title">
                {this.state.title[this.state.screenNumber]}
              </h1>
              <h2 className="welcome__subtitle">
                {this.state.content[this.state.screenNumber]}
              </h2>
              <button
                className={classNames(buttonClass)}
                onClick={this.increaseScreenNumber}
              >
                Next
              </button>
            </div>
            <div className="welcome__right">
              <img
                alt="tutorial on using peblios"
                className="welcome__image"
                src={this.state.images[this.state.screenNumber]}
              />
            </div>
          </div>
        )}
        {(this.state.screenNumber === 4) && (
          <div className="welcome__sub-container-horiz">
            <h1 className="welcome__title">
              Get Started
            </h1>
            <button
              className="welcome__button welcome__green-button welcome__button-large"
              onClick={this.props.closeWelcomeModal}
            >
              Close
            </button>
            <button
              className="welcome__button welcome__green-button welcome__button-large"
              onClick={this.resetScreenNumber}
            >
              Replay
            </button>
            <button
              className="welcome__button welcome__green-button welcome__button-large"
              onClick={this.startTour}
            >
              Start Creating with our guided tour
            </button>
          </div>
        )}
      </section>
    );
  }
}

Welcome.propTypes = {
  closeWelcomeModal: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  ...mainToolbarActions,
}, dispatch);

export default connect(null, mapDispatchToProps)(Welcome);
