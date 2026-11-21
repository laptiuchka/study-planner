import React from 'react';
import { Link } from 'react-router';

export const NotFoundPage: React.FC = () => {
  return (
    <section
      style={{
        textAlign: 'center',
        padding: '48px 20px',
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
      }}
    >
      <h2 style={{ fontSize: '2.4rem', color: '#6b3ba7', marginBottom: '8px' }}>404</h2>
      <p style={{ marginBottom: '20px', color: 'var(--text)' }}>
        Сторінку не знайдено. Можливо, посилання застаріло.
      </p>
      <Link
        to="/tasks"
        style={{
          display: 'inline-block',
          padding: '10px 18px',
          borderRadius: '8px',
          backgroundColor: '#6b3ba7',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Перейти до завдань
      </Link>
    </section>
  );
};