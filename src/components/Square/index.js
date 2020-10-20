import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const Square = ({ data, onClick }) => {
  return (
    <div className='Square'
      onClick={() => onClick(data)}
    >
      <span>{data}</span>
    </div>
  );
};


Square.propTypes = {
  data: PropTypes.any
};


export default Square;
