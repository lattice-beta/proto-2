import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  createClassroom,
  toggleCreateClassroomModal,
} from '../../../../action/classroom';

import Modal from '../../../Modal/Modal';
import InputField from '../../../InputField/InputField';
import TextareaField from '../../../TextareaField/TextareaField';
import Button from '../../../Button/Button';

import './createClassModal.scss';

export const CreateClassroomModal = ({
  userId,
  submittingData,
  // eslint-disable-next-line no-shadow
  createClassroom,
  // eslint-disable-next-line no-shadow
  toggleCreateClassroomModal,
  ...props
}) => {
  const [className, setClassName] = useState('');
  const [firstName, setFirstName] = useState(props.firstName);
  const [lastName, setLastName] = useState(props.lastName);
  const [subject, setSubject] = useState('');
  const [room, setRoom] = useState('');
  const [section, setSection] = useState('');
  // const [grade, setGrade] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    const classData = {
      name: className,
      subject,
      room,
      firstName,
      lastName,
      description,
      section,
    };
    createClassroom(classData);
  };

  return (
    <Modal
      header='Create Class'
      modalClass='create-class-modal'
      modalClose={() => toggleCreateClassroomModal()}
    >
      <div className='create-class-modal__required'>*required</div>
      <form action=''>
        <div className='create-class-modal__row'>
          <InputField
            state={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            label='*Teacher Name'
            placeholder='First name'
            containerWidth='143px'
            style={{
              marginRight: '20px',
            }}
          />
          <InputField
            state={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder='Last name'
            containerWidth='143px'
            style={{
              marginTop: '28px',
            }}
          />
        </div>
        <div className='create-class-modal__row'>
          <InputField
            state={className}
            onChange={(e) => {
              setClassName(e.target.value);
            }}
            label='*Class Name'
            placeholder='enter class name'
            containerWidth='100%'
          />
        </div>
        <div className='create-class-modal__row'>
          <InputField
            state={section}
            onChange={(e) => {
              setSection(e.target.value);
            }}
            label='Section'
            placeholder='enter section'
            containerWidth='199px'
            style={{ marginRight: '30px' }}
          />
          <InputField
            state={room}
            onChange={(e) => {
              setRoom(e.target.value);
            }}
            label='Room'
            placeholder='enter room'
            containerWidth='199px'
            style={{ marginRight: '30px' }}
          />
          <InputField
            state={subject}
            onChange={(e) => {
              setSubject(e.target.value);
            }}
            label='Subject'
            placeholder='enter subject'
            containerWidth='199px'
          />
        </div>
        <div className='create-class-modal__row'>
          <TextareaField
            state={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            label='Description'
            placeholder='type description...'
            style={{
              containerWidth: '100%',
              textareaHeight: '96px',
            }}
          />
        </div>
        <div className='create-class-modal__row'>
          <Button
            className='secondary'
            onClick={() => {
              toggleCreateClassroomModal();
            }}
            style={{ marginLeft: 'auto', marginRight: '16px' }}
          >
            Cancel
          </Button>
          <Button
            className='primary'
            onClick={handleSubmit}
            disabled={
              !className.trim() || !firstName || !lastName || submittingData
            }
          >
            Create class
          </Button>
        </div>
      </form>
    </Modal>
  );
};

CreateClassroomModal.propTypes = {
  createClassroom: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  submittingData: PropTypes.bool.isRequired,
  toggleCreateClassroomModal: PropTypes.func.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
};

CreateClassroomModal.defaultProps = {
  firstName: '',
  lastName: '',
};

const mapStateToProps = state => ({
  userId: state.user.id,
  submittingData: state.classroom.submittingData,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    createClassroom,
    toggleCreateClassroomModal,
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateClassroomModal);
