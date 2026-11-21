import React, { useState, useEffect, useCallback } from 'react';
import { httpClient, setHttpClientToken } from '../api/httpClient';
import type { AuthUser, LoginResponse } from '../types/task';
import { AuthContext } from './authContextObject';

const TOKEN_STORAGE_KEY = 'study_planner_access_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    const saved = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (saved) {
      setHttpClientToken(saved);
    }
    return saved;
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(() =>
    Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))
  );

  useEffect(() => {
    if (!accessToken) return;

    setHttpClientToken(accessToken);

    httpClient
      .get<AuthUser>('/auth/me', { requiresAuth: true })
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setHttpClientToken(null);
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  }, [accessToken]);

  const login = useCallback(async (username: string, password: string) => {
    const response = await httpClient.post<LoginResponse>('/auth/login', {
      username,
      password,
      expiresInMins: 60,
    });

    localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
    setHttpClientToken(response.accessToken);
    setAccessToken(response.accessToken);

    const me = await httpClient.get<AuthUser>('/auth/me', { requiresAuth: true });
    setUser(me);
    setIsAuthLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setHttpClientToken(null);
    setAccessToken(null);
    setUser(null);
    setIsAuthLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: Boolean(accessToken && user),
        isAuthLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};