import React, { useState } from 'react';

import Modal from '../../Modal/Modal';
import InputField from '../../InputField/InputField';
import Dropdown from '../../Dropdown/Dropdown';
import TextareaField from '../../TextareaField/TextareaField';
import Button from '../../Button/Button';

import './createClassModal.scss';

export const CreateClassroomModal = ({ modalClose }) => {
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [room, setRoom] = useState('');
  const [grade, setGrade] = useState('');
  const [description, setDescription] = useState('');

  const onClassNameChange = (e) => {
    const value = e.target.value.trim();
    setClassName(() => value);
  };

  return (
    <Modal
      header="Create Class"
      modalClass="create-class-modal"
      modalClose={modalClose}
    >
      <div className="create-class-modal__required">
        *required
      </div>
      <form action="">
        <div className="create-class-modal__row">
          <InputField
            state={className}
            onChange={onClassNameChange}
            label="*Class Name"
            placeholder="enter class name"
            containerWidth="100%"
          />
        </div>
        <div className="create-class-modal__row">
          <Dropdown
            placeholder="Grade"
            style={{ width: '100px', marginTop: '28px', marginRight: '30px' }}
            state={grade}
            setState={setGrade}
            options={[
              {
                name: '10th',
                value: 10
              },
              {
                name: '9th',
                value: 9
              },
              {
                name: '8th',
                value: 8
              }, {
                name: '7th',
                value: 7
              },
              {
                name: '6th Standard',
                value: 6
              }
            ]}
          />
          <InputField
            state={room}
            onChange={(e) => { setRoom(e.target.value.trim()); }}
            label="Room"
            placeholder="enter subject"
            containerWidth="199px"
            style={{ marginRight: '30px' }}
          />
          <InputField
            state={subject}
            onChange={(e) => { setSubject(e.target.value.trim()); }}
            label="Subject"
            placeholder="enter subject"
            containerWidth="199px"
          />
        </div>
        <div className="create-class-modal__row">
          <TextareaField
            state={description}
            onChange={(e) => { setDescription(e.target.value.trim()); }}
            label="Description"
            placeholder="type description..."
            style={{
              containerWidth: '100%',
              textareaHeight: '96px'
            }}
          />
        </div>
        <div className="create-class-modal__row">
          <Button className="secondary" onClick={modalClose} style={{ marginLeft: 'auto', marginRight: '16px' }}>
            Cancel
          </Button>
          <Button className="primary" disabled={!className}>
            Create class
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClassroomModal;
