import React from 'react';
import Modal from '../../app/components/Modal/Modal';

export default { title: 'Modal' };

export const modal = () => (
  <Modal
    header="This is the modal header"
    modalClose={() => {}}
  >
    This is the modal body!
  </Modal>
);
