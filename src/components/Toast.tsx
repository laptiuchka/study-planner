import React, { useEffect } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import './Toast.scss';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useTaskContext();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      hideToast();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.type}`}>
      <span className="toast__message">{toast.text}</span>
      <button className="toast__close-btn" onClick={hideToast} type="button">
        ✕
      </button>
    </div>
  );
};