import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip-lite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as navigationAction from '../../../action/navigation.js';
import TableOfContentsSVG from '../../../images/table-of-conent-icon.svg';
import { SCREEN_SIZE_786 } from '../../../constants/screenSizeConstants';

require('./navigation.scss');

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isNavigationOpen: this.props.isNavigationOpen };
    if (window.screen.width <= SCREEN_SIZE_786) {
      this.state = { isNavigationOpen: false };
      this.props.closeNavigationContent();
    } else {
      this.state = { isNavigationOpen: this.props.isNavigationOpen };
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      const yNavigationContent = this.props.navigationContent;
      const yNavigationLength = this.props.navigationContent.length;
      for (let i = yNavigationLength - 1; i >= 0; i -= 1) {
        if (window.pageYOffset > yNavigationContent[i].y) {
          this.props.setYPosition(window.pageYOffset);
          window.scrollTo(0, window.pageYOffset);
          this.props.setYNavigation(i);
          return;
        }
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.yNavigation !== this.props.yNavigation) {
      this.forceUpdate();
    }
  }

  openNavigationContent = () => {
    this.setState({ isNavigationOpen: true });
    this.props.openNavigationContent();
  }

  closeNavigationContent = () => {
    this.setState({ isNavigationOpen: false });
    this.props.closeNavigationContent();
  }

  scrollTo=(y) => {
    this.props.setYPosition(y + 10);
    window.scrollTo(0, y + 10);
  }

  render() {
    return (
      <div>
        <button
          className="navigation__open-button"
          onClick={this.openNavigationContent}
        >
          <Tooltip content="Table of Contents">
            <TableOfContentsSVG alt="Table of Contents" />
          </Tooltip>
        </button>
        {this.state.isNavigationOpen && (
          <section
            className={`navigation__container ${this.props.preview ? 'navigation__container--expanded' : ''}`}
          >
            <nav className="navigation__options">
              {this.props.preview || (
                <Tooltip content="Refresh">
                  <button
                    className="navigation__option-button"
                    onClick={() => { this.props.createNavigationContent(this.props.layout); }}
                  >
                    <i className="fas fa-redo"></i>
                  </button>
                </Tooltip>
              )}
              <Tooltip content="Close">
                <button
                  className="navigation__option-button"
                  onClick={this.closeNavigationContent}
                >
                  <i className="fas fa-times"></i>
                </button>
              </Tooltip>
            </nav>
            <li className="navigation__items">
              {
                this.props.pageHeading !== '' && (
                  <ul className="navigation__item-title">
                    {this.props.pageHeading}
                  </ul>
                )}
              {
                this.props.navigationContent.map((navItem, i) => (
                  <ul className="navigation__item">
                    <button
                  className={`navigation__button navigation__button-${navItem.type} ${(i === this.props.yNavigation) ? `navigation__button-${navItem.type}--selected` : ''}`} // eslint-disable-line
                      onClick={() => { this.scrollTo(navItem.y); }}
                    >
                      {navItem.content}
                    </button>
                  </ul>
                ))
              }
            </li>
          </section>
        )}
      </div>
    );
  }
}

Navigation.propTypes = {
  closeNavigationContent: PropTypes.func.isRequired,
  createNavigationContent: PropTypes.func.isRequired,
  isNavigationOpen: PropTypes.bool.isRequired,
  layout: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  navigationContent: PropTypes.arrayOf(PropTypes.shape).isRequired,
  openNavigationContent: PropTypes.func.isRequired,
  pageHeading: PropTypes.string.isRequired,
  preview: PropTypes.bool.isRequired,
  setYNavigation: PropTypes.func.isRequired,
  setYPosition: PropTypes.func.isRequired,
  yNavigation: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  isNavigationOpen: state.navigation.isNavigationOpen,
  layout: state.page.layout,
  navigationContent: state.navigation.navigationContent,
  pageHeading: state.page.pageHeading,
  preview: state.page.preview,
  yNavigation: state.navigation.yNavigation,
  yPosition: state.navigation.yPosition
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...navigationAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
