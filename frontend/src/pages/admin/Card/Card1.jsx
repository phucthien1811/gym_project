import React from 'react';

const Card1 = ({ title, content }) => {
  return (
    <div className="card1">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

export default Card1;