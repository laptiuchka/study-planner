import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useTaskContext } from '../hooks/useTaskContext';
import './ProfilePage.scss';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useTaskContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Ви вийшли із системи', 'info');
    navigate('/login');
  };

  return (
    <section className="profile-page">
      <div className="profile-page__card">
        <div className="profile-page__header">
          {user?.image && (
            <img
              src={user.image}
              alt={user.username}
              className="profile-page__avatar"
            />
          )}
          <div>
            <h2 className="profile-page__title">
              {user ? `${user.firstName} ${user.lastName}` : 'Профіль користувача'}
            </h2>
            <span className="profile-page__badge">
              {isAuthenticated ? 'Авторизований користувач' : 'Не авторизовано'}
            </span>
          </div>
        </div>

        <div className="profile-page__info">
          <div className="profile-page__row">
            <span className="profile-page__label">Username:</span>
            <span className="profile-page__value">{user?.username}</span>
          </div>
          <div className="profile-page__row">
            <span className="profile-page__label">Email:</span>
            <span className="profile-page__value">{user?.email}</span>
          </div>
          <div className="profile-page__row">
            <span className="profile-page__label">Статус сесії:</span>
            <span className="profile-page__value profile-page__value--active">
              Активна (Bearer token встановлено)
            </span>
          </div>
        </div>

        <button
          type="button"
          className="profile-page__logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </section>
  );
};