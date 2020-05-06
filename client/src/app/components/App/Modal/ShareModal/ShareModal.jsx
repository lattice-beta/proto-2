import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Dropdown from './Dropdown/Dropdown';

require('./shareModal.scss');

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.copyShareLink = this.copyShareLink.bind(this);
    this.state = { linkType: 'autoRemixLink' };
  }

  componentDidMount() {
    this.renderClassroomWidget();
  }

  copyShareLink() {
    this.input.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.log(err);
    }
  }

  linkTypeChanged = (e) => {
    const linkType = e.target.value;
    this.setState({ linkType });
  }

  renderClassroomWidget() {
    gapi.sharetoclassroom.render(this.widget, //eslint-disable-line
      { size: 64,
        url: this.props.shareURL });
  }

  render() {
    const options = [{
      value: 'autoRemixLink',
      displayKey: 'Share as assignment',
      selected: true,
    },
    {
      value: 'link',
      displayKey: 'ViewOnly',
    }];
    return (
      <section className="share__container">
        <div className="share__option">
          <h2 className="share__text-primary">
            Share
          </h2>
          <Dropdown
            options={options}
            onChange={this.linkTypeChanged}
            formLabel="Share Options"
            formControlClassName="share-modal__select"
          />
          <input
            className="share__input"
            ref={(element) => { this.input = element; }}
            value={this.state.linkType === 'link' ? this.props.shareURL : `${this.props.shareURL}?autoRemix=true`}
            data-test="share-modal__input"
            readOnly
          />
          <button
            className="share__link"
            onClick={this.copyShareLink}
          >
            copy to clipboard
          </button>
        </div>
        <p className="share__text-secondary">or</p>
        <div className="share__option">
          <h2 className="share__text-primary share__option__text-classroom"> Share to Google Classroom </h2>
          <div
            id="widget-div"
            ref={(element) => { this.widget = element; }}
          >
          </div>
        </div>
      </section>
    );
  }
}

Share.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  shareURL: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  shareURL: state.mainToolbar.shareURL
});

export default connect(mapStateToProps, null)(Share);
