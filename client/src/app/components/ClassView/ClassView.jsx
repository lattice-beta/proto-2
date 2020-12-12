import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DashboardView from '../DashboardBase/DashboardBase';
import TabSwitcher from '../TabSwitcher/TabSwitcher';
import GenericLoader from '../GenericLoader/LoadingMessage';
import RightCrumbIcon from '../../images/right.svg';
import './classView.scss';

// pages
import Assignments from './Assignments/Assignments';
import People from './People/People';

// actions
import { fetchCurrentClassroomDetails, clearCurrentClassroom } from '../../action/classroom';

// eslint-disable-next-line no-shadow
const ClassView = ({ match, fetchCurrentClassroomDetails, clearCurrentClassroom, currentClassroom, dataLoading }) => {
  useEffect(() => {
    fetchCurrentClassroomDetails(match.params.classId);

    return () => {
      clearCurrentClassroom();
    };
  }, []);
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
    <DashboardView>
      {
        dataLoading
          ? <GenericLoader />
          : (

            <main className="class-view__main">
              <div className="class-view__header-area">
                <div className="class-view__header-area__bread-crumbs">
                  <span>My Classes</span>
                  <RightCrumbIcon />
                  <span>{currentClassroom && currentClassroom.name}</span>
                </div>
                <div className="class-view__header-area__class-code">
                  Class code :
                  {' '}
                  <input
                    value={currentClassroom && currentClassroom.id}
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
              </div>
              <TabSwitcher
                className="class-view__tab-switcher"
                style={{
                  width: '100%'
                }}
                tabs={[
                  {
                    label: 'Assignments',
                    component: <Assignments classroomId={match.params.classId} />
                  },
                  {
                    label: 'People',
                    component: <People />
                  },
                ]}
              />
            </main>
          )
      }
    </DashboardView>
  );
};

ClassView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      classId: PropTypes.string.isRequired
    })
  }).isRequired,
  fetchCurrentClassroomDetails: PropTypes.func.isRequired,
  clearCurrentClassroom: PropTypes.func.isRequired,
  currentClassroom: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  dataLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  currentClassroom: state.classroom.currentClassroom,
  dataLoading: state.classroom.dataLoading
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCurrentClassroomDetails,
  clearCurrentClassroom
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(ClassView);
