import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState({
    accessToken: null,
    expiresAt: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('expires_at');

    if (accessToken && new Date().getTime() < expiresAt) {
      setIsAuthenticated(true);
      setAuthData({ accessToken, expiresAt });
    }
  }, []);

  const login = (accessToken, expiresAt) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('expires_at', expiresAt);
    setIsAuthenticated(true);
    setAuthData({ accessToken, expiresAt });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    setIsAuthenticated(false);
    setAuthData({ accessToken: null, expiresAt: null });
    console.log('logout');
    navigate('/');
  };

  const value = useMemo(() => ({
    isAuthenticated,
    authData,
    login,
    logout,
  }), [isAuthenticated, authData]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
