import PropTypes from 'prop-types';
import React from 'react';
import CloseIcon from '../../../../../images/close.svg';
import NoPreview from '../../../../../images/link-alt.svg';
import './linkPreviewCard.scss';

const LinkPreviewCard = ({ title, removeAction, previewURL, url, ...props }) => (
  <div className="link-preview-card">
    <div className="link-preview-card__preview" style={{ backgroundImage: `url(${previewURL})` }}>
      {
        !previewURL && (
          <NoPreview />
        )
      }
    </div>
    <div className="link-preview-card__description">
      <a className="link-preview-card__description__title" href={url} target="_blank" rel="noreferrer">
        {title.length > 85 ? `${title.substr(0, 80)}...` : title}
      </a>
      <div className="link-preview-card__description__footer">
        {
          props.type === 'assignment' && props.linkTriggeredBy !== 'link' ? (
            <React.Fragment>
              <span>copy</span>
              {' '}
              for each student
            </React.Fragment>
          ) : (
            <React.Fragment>
              students can
              {' '}
              <span>view</span>
            </React.Fragment>
          )
        }
      </div>
    </div>
    <button type="button" className="link-preview-card__remove" onClick={removeAction}>
      <CloseIcon />
    </button>
  </div>
);

LinkPreviewCard.propTypes = {
  title: PropTypes.string.isRequired,
  linkTriggeredBy: PropTypes.string.isRequired,
  removeAction: PropTypes.func.isRequired,
  previewURL: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default LinkPreviewCard;
