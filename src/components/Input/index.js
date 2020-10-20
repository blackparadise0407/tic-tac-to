import React from 'react';
import './styles.scss'
const Input = ({ label, ...rest }) => {
  return (
    <div className='Input'>
      <label htmlFor={label} >{label}</label>
      <input
        {...rest}
      />
    </div>
  );
}

export default Input;
