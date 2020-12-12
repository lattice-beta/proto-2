import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import './classCard.scss';

const ClassCard = ({
  classCode,
  classTitle,
  subject,
  grade,
  studentCount,
  ...props
}) => {
  const hiddenTextboxRef = useRef();
  const onCodeCopyClick = () => {
    hiddenTextboxRef.current.focus();
    hiddenTextboxRef.current.select();
    setImmediate(() => {
      document.execCommand('copy');
    });
    setImmediate(() => {
      hiddenTextboxRef.current.blur();
    });
  };

  return (
    <div className='class-card' {...props}>
      <div className="class-card__code">
        <input
          value={classCode}
          onChange={() => {}}
          ref={hiddenTextboxRef}
          onFocus={onCodeCopyClick}
        />
        <svg
          width='15'
          height='18'
          viewBox='0 0 40 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='
                M25.1508 48H7.42459C3.33055 48 0 44.6356 0 40.5V15.0938C0 10.9581 3.33055 7.59375
                7.42459 7.59375H25.1508C29.2449 7.59375 32.5754 10.9581 32.5754 15.0938V40.5C32.5754
                44.6356 29.2449 48 25.1508 48ZM7.42459 11.3438C5.37776 11.3438 3.7123 13.0261 3.7123
                15.0938V40.5C3.7123 42.5676 5.37776 44.25 7.42459 44.25H25.1508C27.1977 44.25 28.8631
                42.5676 28.8631 40.5V15.0938C28.8631 13.0261 27.1977 11.3438 25.1508 11.3438H7.42459ZM40
                35.8125V7.5C40 3.36438 36.6694 0 32.5754 0H11.9722C10.9469 0 10.116 0.839356 10.116
                1.875C10.116 2.91064 10.9469 3.75 11.9722 3.75H32.5754C34.6222 3.75 36.2877 5.43237 36.2877
                7.5V35.8125C36.2877 36.8481 37.1186 37.6875 38.1438 37.6875C39.1691 37.6875 40 36.8481 40 35.8125Z
              '
            fill='#00151E'
          />
        </svg>
      </div>
      <div className='class-card__title'>{classTitle}</div>
      <div className='class-card__subject'>{subject}</div>
      <div className='class-card__card-footer'>
        {grade}
        {' '}
        GRADE
        <span className='circle'></span>
        {studentCount}
        {' '}
        STUDENTS
      </div>
    </div>
  );
};

ClassCard.propTypes = {
  classCode: PropTypes.string.isRequired,
  classTitle: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  grade: PropTypes.string.isRequired,
  studentCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default ClassCard;
