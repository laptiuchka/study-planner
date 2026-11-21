import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Navigate } from 'react-router';
import { loginSchema, type LoginFormData } from '../schemas/authSchema';
import { useAuth } from '../hooks/useAuth';
import { useTaskContext } from '../hooks/useTaskContext';
import './LoginPage.scss';

interface LocationState {
  from?: {
    pathname: string;
    search?: string;
  };
}

export const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const { showToast } = useTaskContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);

  const state = location.state as LocationState | null;
  const redirectPath = state?.from
    ? `${state.from.pathname}${state.from.search || ''}`
    : '/profile';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    try {
      await login(data.username, data.password);
      showToast(`Вітаємо, ${data.username}!`, 'success');
      navigate(redirectPath, { replace: true });
    } catch {
      setAuthError('Невірний логін або пароль. Спробуйте тестові дані DummyJSON.');
    }
  };

  return (
    <section className="login-page">
      <div className="login-page__card">
        <h2 className="login-page__title">Вхід у Study Planner</h2>
        <p className="login-page__subtitle">
          Авторизуйтеся, щоб створювати, редагувати та видаляти завдання
        </p>

        <div className="login-page__hint">
          Тестові дані DummyJSON: <code>emilys</code> / <code>emilyspass</code>
        </div>

        {authError && <div className="login-page__alert">{authError}</div>}

        <form className="login-page__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="login-page__group">
            <label className="login-page__label" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              type="text"
              className={`login-page__input ${errors.username ? 'login-page__input--error' : ''}`}
              placeholder="emilys"
              autoComplete="username"
              disabled={isSubmitting}
              {...register('username')}
            />
            {errors.username && (
              <span className="login-page__error">{errors.username.message}</span>
            )}
          </div>

          <div className="login-page__group">
            <label className="login-page__label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className={`login-page__input ${errors.password ? 'login-page__input--error' : ''}`}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
              {...register('password')}
            />
            {errors.password && (
              <span className="login-page__error">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="login-page__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Виконується вхід...' : 'Увійти'}
          </button>
        </form>
      </div>
    </section>
  );
};