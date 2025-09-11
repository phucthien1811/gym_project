import React from 'react';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/workouts">Workouts</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </nav>
  );
};

export default Navigation;