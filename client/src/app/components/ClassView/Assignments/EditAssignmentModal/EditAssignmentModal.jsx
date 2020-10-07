import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Generic components
import Modal from '../../../Modal/Modal';
import InputField from '../../../InputField/InputField';
import Dropdown from '../../../Dropdown/Dropdown';
import DropdownMultiselect from '../../../DropdownMultiselect/DropdownMultiselect';
import TextareaField from '../../../TextareaField/TextareaField';
import IconButton from '../../../IconButton/IconButton';
import Button from '../../../Button/Button';
import DatePickerField from '../../../DatePickerField/DatePickerField';

import axios from '../../../../utils/axios';
import { SNAPSHOT_DEFAULT_IMG, DEFAULT_PAGE_TITLE } from '../../../../constants/pageConstants';

// icons
import CreateNewIcon from '../../../../images/create_new.svg';
import PeblIcon from '../../../../images/pebl.svg';
import LinkIcon from '../../../../images/link.svg';

// import LessonListCard from '../../LessonListCard/LessonListCard';
import LinkPreviewCard from './LinkPreviewCard/LinkPreviewCard';

// actions
import {
  fetchClassrooms,
  setSubmittinData,
  fetchAssignments,
  createPeblForAssignment,
  toggleEditAssignmentModal,
  fetchCurrentAssignmentDetails,
  clearCurrentAssignmentDetails,
  editAssignment,
} from '../../../../action/classroom';


import './editAssignmentModal.scss';

const EditAssignmentModal = ({
  // eslint-disable-next-line no-shadow
  toggleEditAssignmentModal,
  // eslint-disable-next-line no-shadow
  fetchClassrooms,
  // eslint-disable-next-line no-shadow
  fetchCurrentAssignmentDetails,
  // eslint-disable-next-line no-shadow
  fetchAssignments,
  classroomId,
  classrooms,
  topics,
  userId,
  // eslint-disable-next-line no-shadow
  setSubmittinData,
  // eslint-disable-next-line no-shadow
  createPeblForAssignment,
  // eslint-disable-next-line no-shadow
  clearCurrentAssignmentDetails,
  editingAssignmentId,
  // eslint-disable-next-line no-shadow
  editAssignment,
  currentAssignment,
}) => {
  // form states
  const [classState, setClassState] = useState([classroomId]);
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState();
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [instruction, setInscruction] = useState('');
  const [outOfMarks, setOutOfMarks] = useState('');
  const [type, setType] = useState('assignment');

  // add link states
  const [addLink, setAddLink] = useState('');
  const [addLinkTriggered, setAddLinkTriggered] = useState(false);
  const [linkTriggeredBy, setLinkTriggeredBy] = useState('');
  const [page, setPage] = useState({});

  // resources state
  const [linkAdded, setLinkAdded] = useState(false);

  const linkInputClickOutside = (e) => {
    if (e.target.id === 'trigger-link' ||
    e.target.className === 'icon-button' ||
      e.target.className === 'icon-button__text' ||
      e.target.parentElement.className === 'icon-button__icon'
    ) {
      setTimeout(() => {
        document.removeEventListener('click', linkInputClickOutside);
      }, 0);
    } else if (e.target.id !== 'add-link' && e.target.id !== 'add-link-button') {
      setAddLinkTriggered(() => false);
      document.removeEventListener('click', linkInputClickOutside);
    }
  };

  useEffect(() => {
    fetchClassrooms();
    fetchCurrentAssignmentDetails(editingAssignmentId);
    // cleanup event listener if active and component is closed
    return () => {
      clearCurrentAssignmentDetails();
      document.removeEventListener('click', linkInputClickOutside);
    };
  }, []);

  // handles init
  useEffect(() => {
    setAssignmentTitle(() => currentAssignment.title);
    setInscruction(() => currentAssignment.description);
    setDate(() => currentAssignment.dueDate);
    setOutOfMarks(() => currentAssignment.outOfMarks);
    setTopic(() => currentAssignment.topicId);
    setType(() => currentAssignment.type);

    if (currentAssignment.peblUrl) {
      setLinkTriggeredBy('pebl');
      setAddLink(() => currentAssignment.peblUrl);
      const temp = currentAssignment.peblUrl.split('/');
      const id = temp[temp.length - 1];
      console.log(id);
      axios.get(`/pages/${id}`)
        .then(({ data }) => {
          setPage(data[0]);
          setLinkAdded(() => true);
        });
    } else if (currentAssignment.url) {
      setLinkTriggeredBy('url');
      setAddLink(() => currentAssignment.url);
      setPage({
        title: currentAssignment.url
      });
      setLinkAdded(() => true);
    }
  }, [currentAssignment]);

  const handleSubmit = (publish) => {
    setSubmittinData(true);
    let assignmentData = {
      classroomId,
      title: assignmentTitle,
      dueDate: date,
      description: instruction,
      isPublished: publish,
      outOfMarks,
      topicId: topic
    };
    if (linkAdded) {
      if (linkTriggeredBy === 'pebl') {
        assignmentData = {
          ...assignmentData,
          peblUrl: addLink
        };
      } else {
        assignmentData = {
          ...assignmentData,
          url: addLink
        };
      }
    }
    console.log(assignmentData);
    console.log(currentAssignment);
    editAssignment({ assignmentId: currentAssignment.id, ...assignmentData },)
      .then((data) => {
        console.log(data);
        setSubmittinData(false);
        toggleEditAssignmentModal();
        fetchAssignments(classroomId);
      })
      .catch((err) => {
        console.log(err);
        setSubmittinData(false);
      });
  };


  return (
    <Modal
      header={(
        type === 'material' ? 'Edit resource'
          : (
            <React.Fragment>
              <div className="create-assignment-modal__header__title">
                Edit Assignment
              </div>
              <span className="create-assignment-modal__header__sub-title">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus, excepturi?
              </span>
            </React.Fragment>
          )
      )}
      modalClass="create-assignment-modal"
    >
      <div className="create-assignment-modal__required">
        *required
      </div>
      <form action="">
        <div className="create-assignment-modal__row">
          <DropdownMultiselect
            disabled
            placeholder="*Select Class"
            style={{ width: '149px', marginTop: '26px', marginRight: '40px' }}
            selected={classState}
            setSelected={setClassState}
            options={
              classrooms ? classrooms.map(classroom => ({
                name: classroom.name,
                value: classroom.id
              }))
                : [
                  {
                    name: 'Loading...',
                    value: null
                  }
                ]
            }
          />
          <Dropdown
            placeholder="Select topic"
            style={{ width: '149px', marginTop: '26px', marginRight: '40px' }}
            state={topic}
            setState={setTopic}
            disabled={!classState}
            options={
              // eslint-disable-next-line no-shadow
              topics ? topics.map(topic => ({
                name: topic.name,
                value: topic._id
              }))
                : [
                  {
                    name: 'Loading...',
                    value: null
                  }
                ]
            }
          />
          {
            type === 'assignment' && (
              <InputField
                state={outOfMarks}
                onChange={(e) => { setOutOfMarks(e.target.value); }}
                label="Point value"
                containerWidth="171px"
                type="number"
                style={{
                  marginTop: '-1px',
                  marginRight: '40px'
                }}
              />
            )}
          {
            type === 'assignment' && (
              <DatePickerField
                state={date}
                setState={setDate}
                label="Due Date"
                containerWidth="171px"
                calendarPosition="right"
              />
            )}
        </div>
        <div className="create-assignment-modal__row">
          <InputField
            state={assignmentTitle}
            onChange={(e) => { setAssignmentTitle(e.target.value); }}
            label="*Assignment title"
            placeholder="enter class name"
            containerWidth="100%"
          />
        </div>
        <div className="create-assignment-modal__row">
          <TextareaField
            state={instruction}
            onChange={(e) => { setInscruction(e.target.value); }}
            label="Instruction (optional)"
            placeholder="type instructions"
            style={{
              containerWidth: '100%',
              textareaHeight: '96px'
            }}
          />
        </div>
        <div className="create-assignment-modal__action-area">
          <IconButton
            disabled={linkAdded}
            icon={<PeblIcon />}
            style={{ marginRight: '16px' }}
            onClick={() => {
              setLinkTriggeredBy('pebl');
              setAddLinkTriggered(state => !state);
              setTimeout(() => {
                if (document.querySelector('#add-link')) {
                  document.querySelector('#add-link').focus();
                }
              }, 0);
              document.addEventListener('click', linkInputClickOutside);
            }}
          >
            Select Pebl
          </IconButton>
          <IconButton
            disabled={linkAdded}
            icon={<CreateNewIcon />}
            style={{ marginRight: '16px' }}
            onClick={() => {
              setLinkTriggeredBy('pebl');
              createPeblForAssignment(assignmentTitle)
                .then((id) => {
                  console.log(id);
                  setLinkAdded(true);
                  setAddLink(`${window.location.origin}/pebl/${id}`);
                  setPage({
                    title: assignmentTitle || DEFAULT_PAGE_TITLE,
                    snapshotPath: SNAPSHOT_DEFAULT_IMG
                  });
                });
            }}
          >
            Create new Pebl
          </IconButton>
          <IconButton
            disabled={linkAdded}
            icon={<LinkIcon />}
            style={{ marginRight: 'auto' }}
            id="trigger-link"
            onClick={() => {
              setLinkTriggeredBy('link');
              setAddLinkTriggered(state => !state);
              setTimeout(() => {
                if (document.querySelector('#add-link')) {
                  document.querySelector('#add-link').focus();
                }
              }, 0);
              document.addEventListener('click', linkInputClickOutside);
            }}
          >
            Add link
          </IconButton>
          <Button
            style={{ marginRight: '16px' }}
            onClick={() => {
              toggleEditAssignmentModal();
            }}
            className="secondary"
          >
            Cancel
          </Button>
          <Dropdown
            placeholder="Publish"
            className="btn"
            style={{ width: '126px' }}
            disabled={!classState || !assignmentTitle}
            options={[
              {
                name: 'Publish',
                value: 'publish',
                onClick: () => { handleSubmit(true); }
              },
              {
                name: 'Save Draft',
                value: 'save',
                onClick: () => { handleSubmit(false); }
              },
            ]}
          />
        </div>
        { linkAdded && (
          <div className="create-assignment-modal__resource">
            {linkAdded && (
              <LinkPreviewCard
                title={page ? page.title : ''}
                previewURL={page ? page.snapshotPath : ''}
                removeAction={() => {
                  setLinkAdded(false);
                  // setLinkType(-1);
                }}
              />
            )}
          </div>
        )}
      </form>
      {
        addLinkTriggered && (
          <form
            className="create-assignment-modal__link-box"
            style={{
              left: linkTriggeredBy === 'pebl' ? '40px' : '320px'
            }}
            onSubmit={(e) => {
              e.preventDefault();
              const expression = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
              const regex = new RegExp(expression);
              if (addLink.match(regex)) {
                if (linkTriggeredBy === 'pebl') {
                  const temp = addLink.split('/');
                  const id = temp[temp.length - 1];
                  console.log(id);
                  axios.get(`/pages/${id}`)
                    .then(({ data }) => {
                      setPage(data[0]);
                      setLinkAdded(() => true);
                      setAddLinkTriggered(false);
                    });
                } else {
                  setLinkAdded(() => true);
                  setAddLinkTriggered(false);
                  setPage({
                    title: addLink
                  });
                }
              }
            }}
          >
            <InputField
              label="Link"
              containerWidth="305px"
              state={addLink}
              onChange={(e) => { setAddLink(e.target.value); }}
              placeholder="enter link"
              id="add-link"
            />
            <Button
              className="primary"
              style={{ marginLeft: '10px' }}
              id="add-link-button"
              type="submit"
            >
              Add
            </Button>
          </form>
        )
      }
    </Modal>
  );
};

EditAssignmentModal.propTypes = {
  toggleEditAssignmentModal: PropTypes.func.isRequired,
  setSubmittinData: PropTypes.func.isRequired,
  topics: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired
  })).isRequired,
  classroomId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  classrooms: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchClassrooms: PropTypes.func.isRequired,
  fetchAssignments: PropTypes.func.isRequired,
  createPeblForAssignment: PropTypes.func.isRequired,
  fetchCurrentAssignmentDetails: PropTypes.func.isRequired,
  editingAssignmentId: PropTypes.string.isRequired,
  currentAssignment: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    peblUrl: PropTypes.string,
    url: PropTypes.string,
    dueDate: PropTypes.string,
    outOfMarks: PropTypes.string,
    topicId: PropTypes.string
  }).isRequired,
  clearCurrentAssignmentDetails: PropTypes.func.isRequired,
  editAssignment: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  classroomId: state.classroom.currentClassroom.id,
  classrooms: state.classroom.classrooms,
  userId: state.user.id,
  topics: state.classroom.topics,
  editingAssignmentId: state.classroom.editingAssignmentId,
  currentAssignment: state.classroom.currentAssignment,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleEditAssignmentModal,
  fetchClassrooms,
  setSubmittinData,
  createPeblForAssignment,
  fetchAssignments,
  fetchCurrentAssignmentDetails,
  clearCurrentAssignmentDetails,
  editAssignment
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditAssignmentModal);
