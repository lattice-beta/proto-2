import classNames from 'classnames';
import Autocomplete from 'react-autocomplete';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  addPageTag,
  deletePageTag
} from '../../../../action/page.js';
import axios from '../../../../utils/axios';

require('./tags.scss');

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      value: ''
    };
  }

  componentDidMount() {
    if (this.input) {
      this.input.handleKeyDown = (e) => {
        this.handleEnter(e);
      };
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.preview && prevProps.preview) {
      this.input.handleKeyDown = (e) => {
        this.handleEnter(e);
      };
    }
  }

  handleInputChange=(e) => {
    this.setState({ value: e.target.value });
    const enteredText = e.target.value.toLowerCase().trim();
    if (enteredText) {
      axios.get(`/tags/startingWith/${enteredText}`)
        .then((result) => {
          const suggestedTags = [];
          result.data.forEach((tag) => {
            suggestedTags.push({ label: tag.name });
          });
          this.setState({ tags: suggestedTags });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        tags: [],
        value: ''
      });
    }
  }

  handleEnter=(e) => {
    const tagName = e.target.value.toLowerCase().trim();
    if (e.keyCode === 13) {
      this.addTag(tagName);
      this.setState({
        tags: [],
        value: ''
      });
    }
  }

  handleSelect = (value) => {
    this.addTag(value);
  }

  addTag=(tagName) => {
    axios.post('/tags', {
      name: tagName
    })
      .then((result) => {
        document.querySelector('.tags__list-item:last-child').scrollIntoView(false);
      })
      .catch((error) => {
        console.log(error);
      });
    this.props.addPageTag(tagName);
    // TODO : Why do i need to forceupdate here?
    this.forceUpdate();
  }

  renderTagsList(tags) {
    const tagsListClass = classNames('tags__list', {
      'tags__list--preview': (this.props.preview === true)
    });
    return (
      <ul className={classNames(tagsListClass)}>
        {tags && tags.map((tag, i) => (
          <li
            className="tags__list-item"
          >
            <a
              className="tags__name"
              data-test="tags-name"
              href={`https://www.peblio.co/studio/${tag}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tag}
            </a>
            {!this.props.preview && (
              <button
                className="tags__delete-tag"
                onClick={() => this.props.deletePageTag(tag)}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const tagsContainerClass = classNames('tags__container', {
      'tags__container--canvas': (this.props.container === 'canvas')
    });

    return (
      <div className={classNames(tagsContainerClass)}>
        {!this.props.preview && (
          <Autocomplete
            ref={(element) => { this.input = element; }}
            getItemValue={item => item.label}
            items={this.state.tags}
            renderItem={(item, isHighlighted) => (
              <div
                style={{ background: isHighlighted ? 'lightgray' : 'white' }}
                className="tags__input-item"
              >
                {item.label}
              </div>
            )}
            value={this.state.value}
            onChange={e => this.handleInputChange(e)}
            onSelect={value => this.handleSelect(value)}
            inputProps={
              { 'placeholder': 'Enter tags..',
                'data-test': 'enter-tag' }
            }
          />
        )}
        {this.renderTagsList(this.props.tags)}
      </div>
    );
  }
}

Tags.propTypes = {
  container: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  preview: PropTypes.bool.isRequired,
  addPageTag: PropTypes.func.isRequired,
  deletePageTag: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    tags: state.page.tags
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({
  addPageTag,
  deletePageTag
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Tags);
