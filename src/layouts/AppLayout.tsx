import React from 'react';
import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Toast } from '../components/Toast';

export const AppLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Toast />
    </div>
  );
};