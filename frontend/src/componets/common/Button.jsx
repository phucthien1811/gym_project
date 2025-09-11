import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', type = 'button' }) => {
  return (
    <button 
      className={`button ${variant}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;