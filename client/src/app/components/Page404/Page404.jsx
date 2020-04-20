import React from 'react';
import ToolbarLogo from '../../images/logo.svg';

import './page404.scss';

class Page404 extends React.Component {
  render() {
    return (
      <div className="page404__container">
        <div className="page404__nav">
          <a
            className="logo_toolbar"
            href="https://www.peblio.co/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ToolbarLogo alt="logo in toolbar" />
          </a>
        </div>
        <div className="page404__sub-container">
          <h1 className="page404__heading">
            Sorry, the page you are looking for is not available.
          </h1>
        </div>
      </div>
    );
  }
}

export default Page404;
