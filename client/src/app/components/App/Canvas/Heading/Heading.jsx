import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  setPageAuthor,
  setPageHeading,
  setParentPageAuthor
} from '../../../../action/page.js';
import axios from '../../../../utils/axios';
import ForkSVG from '../../../../images/fork.svg';

require('./heading.scss');

class Heading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorStudent: true,
      isParentAuthorStudent: true,
    };
  }

  componentDidMount() {
    if (this.props.id) {
      axios.get(`/users/pageAuthor/${this.props.id}`)
        .then((res) => {
          this.props.setPageAuthor(res.data.name);
          if (res.data.type && res.data.type !== 'student') {
            this.setState({ isAuthorStudent: false });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.parentId && (prevProps.parentId !== this.props.parentId)) {
      axios.get(`/users/parentPageAuthor/${this.props.id}`)
        .then((res) => {
          this.props.setParentPageAuthor(res.data.name);
          if (res.data.type && res.data.type !== 'student') {
            this.setState({ isParentAuthorStudent: false });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  renderAuthor(author, isAuthorStudent) {
    if (isAuthorStudent) {
      return (
        <p
          className="heading__author-name"
        >
          {author}
        </p>
      );
    }
    return (
      <a
        className="heading__author-name heading__author-link"
        href={`/profile/${author}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {author}
      </a>
    );
  }

  render() {
    return (
      <div>
        {(this.props.pageHeading === '' && this.props.preview) || (
          <input
            type="text"
            className='heading__title'
            placeholder="Enter title.."
            value={this.props.pageHeading}
            onChange={this.props.setPageHeading}
          />
        )}
        <div className="heading__author-container">

          {(this.props.pageAuthor) && (
            <p className="heading__author-text">
              by
              {this.renderAuthor(this.props.pageAuthor, this.state.isAuthorStudent)}
            </p>
          )}
          {(this.props.parentPageAuthor) && (
            <p className="heading__author-text">
              (
              <ForkSVG
                className="heading__svg"
                alt="forked from"
              />
              Remixed from
              {this.renderAuthor(this.props.parentPageAuthor, this.state.isParentAuthorStudent)}
              )
            </p>
          )}
        </div>
      </div>
    );
  }
}

Heading.propTypes = {
  id: PropTypes.string.isRequired,
  parentId: PropTypes.string.isRequired,
  pageAuthor: PropTypes.string.isRequired,
  parentPageAuthor: PropTypes.string.isRequired,
  pageHeading: PropTypes.string.isRequired,
  preview: PropTypes.bool.isRequired,
  setPageAuthor: PropTypes.func.isRequired,
  setPageHeading: PropTypes.func.isRequired,
  setParentPageAuthor: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    id: state.page.id,
    parentId: state.page.parentId,
    pageAuthor: state.page.pageAuthor,
    parentPageAuthor: state.page.parentPageAuthor,
    pageHeading: state.page.pageHeading,
    preview: state.page.preview,
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({
  setPageAuthor,
  setPageHeading,
  setParentPageAuthor
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Heading);
