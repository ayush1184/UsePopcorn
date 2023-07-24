import { useState } from 'react';
import PropTypes from 'prop-types';

// Full Star

/*
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="#000"
  stroke="#000"
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
  </svg>
*/

// Empty Stars

/*
  <svg
  xmlns='http://www.w3.org/2000/svg'
  fill='none'
  viewBox='0 0 24 24'
  stroke='#000'
>
  <path
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='{1}'
    d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
  />
</svg>
*/

StarRating.propTypes = {
  maxRating: PropTypes.number,
  defaultRating: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,
  messages: PropTypes.array,
  onSetRating: PropTypes.func,
  className: PropTypes.string,
};

export default function StarRating({
  maxRating = 10,
  className = '',
  color = `#fcc419`,
  size = 48,
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  const containerStyle = {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `space-between`,
  };

  const starContainerStyle = {
    display: `flex`,
    // marginRight: `30px`,
  };

  const textStyle = {
    margin: 0,
    display: `inline-block`,
    color,
    fontSize: `${size / 1.5}px`,
  };

  function handleRating(rating) {
    setRating(rating);
    if (onSetRating) onSetRating(rating);
  }

  return (
    <div style={containerStyle}>
      <div className='stars' style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span
            style={{ display: `flex`, alignItems: `center` }}
            key={i}
            onClick={() => handleRating(i + 1)}
            onMouseEnter={setTempRating.bind(_, i + 1)}
            onMouseLeave={setTempRating.bind(_, 0)}
          >
            <Star
              full={tempRating ? tempRating > i : rating > i}
              color={color}
              size={size}
            />

            {/* {tempRating ? (
              tempRating > i ? (
                <FullStar borderColor={borderColor} fillColor={fillColor} />
              ) : (
                <EmptyStar borderColor={borderColor} fillColor={fillColor} />
              )
            ) : rating > i ? (
              <FullStar borderColor={borderColor} fillColor={fillColor} />
            ) : (
              <EmptyStar borderColor={borderColor} fillColor={fillColor} />
            )} */}
          </span>
        ))}
      </div>
      <p className='star-num' style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating - 1] || messages[rating - 1]
          : tempRating || rating || ``}
      </p>
    </div>
  );
}

function Star({ full, color, size }) {
  const starStyle = {
    height: `${size}px`,
    width: `${size}px`,
    margin: `0`,
    cursor: `pointer`,
  };

  return full ? (
    // Full Star
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
      fill={color}
      stroke={color}
      style={starStyle}
    >
      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
    </svg>
  ) : (
    // Empty Star
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke={color}
      style={starStyle}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='{1}'
        d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
      />
    </svg>
  );
}
