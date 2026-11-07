import React from 'react';
import './Header.scss';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="header__title">Study Planner</h1>
      <p className="header__subtitle">Плануйте та відстежуйте свій навчальний прогрес</p>
    </header>
  );
};