import React, { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt'
import PropTypes from 'prop-types';
import './styles.scss';

const Card = ({ item, index, func }) => {
  const cardEl = useRef(null)

  useEffect(() => {
    VanillaTilt.init(cardEl.current, {
      max: 25,
      speed: 400,
      scale: 1.2,
      // reverse: true,
      perspective: 1000,
    })
  }, [cardEl])

  return (
    <div
      ref={cardEl}
      key={index}
      onClick={() => func(item.square)}
      className='Card'>{index === 0 ? 'Go to game start' : `Go to move#${index}`}</div>
  );
};


Card.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  func: PropTypes.func.isRequired,
};


export default Card;
