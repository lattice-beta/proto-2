import React from 'react';
import { fallDown as Menu } from 'react-burger-menu';
import PropTypes from 'prop-types';

require('./navigationHamburger.scss');

class NavigationHamburger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  handleStateChange(state) {
    this.setState({ isOpen: state.isOpen });
  }

  closeMenu() {
    this.setState({ isOpen: false });
  }

  toggleMenu() {
    this.setState(state => ({ isOpen: !state.isOpen }));
  }

  render() {
    return (
      <div
        id="mobile-navigation-hamburger"
        className={`${this.state.isOpen ? 'hamburger--open' : 'hamburger--closed'}`}
      >
        <Menu
          pageWrapId="content-canvas"
          outerContainerId="app"
          isOpen={this.state.isOpen}
          onStateChange={state => this.handleStateChange(state)}
        >
          {this.props.isUserLoggedIn && (
            <button
              className="file-modal__link menu-item"
              onMouseDown={() => {
                this.props.viewPagesModal();
                this.props.toggleFileDropdown();
                this.closeMenu();
              }}
              onKeyDown={() => {
                this.props.viewPagesModal();
                this.props.toggleFileDropdown();
                this.closeMenu();
              }}
              data-test="file-menu__mobile-pages-button"
            >
              <i className="fas fa-bars"></i>
              {' '}
              Open
            </button>
          )}
          <button
            className="file-modal__link menu-item"
            onMouseDown={() => {
              this.props.viewExamplesModal();
              this.props.toggleFileDropdown();
              this.closeMenu();
            }}
            onKeyDown={() => {
              this.props.viewExamplesModal();
              this.props.toggleFileDropdown();
              this.closeMenu();
            }}
            data-test="file-menu__mobile-examples-button"
          >
            <i className="fas fa-folder"></i>
            {' '}
            Examples
          </button>
          <button
            className="file-modal__link menu-item"
            onClick={() => {
              this.closeMenu();
              this.props.sharePebl();
            }}
            data-test="main-toolbar__mobile-share-button"
          >
            Share
          </button>
        </Menu>
      </div>
    );
  }
}

NavigationHamburger.propTypes = {
  viewPagesModal: PropTypes.func.isRequired,
  toggleFileDropdown: PropTypes.func.isRequired,
  viewExamplesModal: PropTypes.func.isRequired,
  sharePebl: PropTypes.func.isRequired,
  isUserLoggedIn: PropTypes.bool.isRequired,
};

export default NavigationHamburger;
