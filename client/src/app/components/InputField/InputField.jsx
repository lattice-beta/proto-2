import React from 'react';
import PropTypes from 'prop-types';
import './inputField.scss';

const InputField = ({
  label,
  state,
  placeholder,
  containerWidth,
  setState,
  ...props
}) => (
  <div className='input-field' style={{ width: containerWidth }}>
    <label htmlFor={label} className='input-field__label'>
      {label}
    </label>
    <input
      name={label}
      value={state}
      className='input-field__text-box'
      onChange={e => setState(e.target.value)}
      placeholder={placeholder}
      {...props}
    />
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  state: PropTypes.node.isRequired,
  setState: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  containerWidth: PropTypes.string.isRequired,
};

export default InputField;
