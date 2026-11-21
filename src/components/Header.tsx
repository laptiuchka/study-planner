import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import './Header.scss';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/tasks');
  };

  return (
    <header className="header">
      <div className="header__brand">
        <NavLink to="/tasks" className="header__title-link">
          <h1 className="header__title">Study Planner</h1>
        </NavLink>
        <p className="header__subtitle">Плануйте та відстежуйте свій навчальний прогрес</p>
      </div>

      <nav className="header__nav" aria-label="Головна навігація">
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
          }
        >
          Tasks
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
          }
        >
          Profile{isAuthenticated && user ? ` (${user.username})` : ''}
        </NavLink>

        {isAuthenticated ? (
          <button
            type="button"
            className="header__auth-btn header__auth-btn--logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `header__auth-btn ${isActive ? 'header__auth-btn--active' : ''}`
            }
          >
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
};