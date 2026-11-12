import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session from localStorage on application start
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('skinwise_token');
      const storedUser = localStorage.getItem('skinwise_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Refresh user profile details from backend
          const res = await authApi.getCurrentUser();
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('skinwise_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out', err);
          localStorage.removeItem('skinwise_token');
          localStorage.removeItem('skinwise_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res?.data) {
      const { token: jwtToken, ...userData } = res.data;
      localStorage.setItem('skinwise_token', jwtToken);
      localStorage.setItem('skinwise_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    if (res?.data) {
      const { token: jwtToken, ...userData } = res.data;
      localStorage.setItem('skinwise_token', jwtToken);
      localStorage.setItem('skinwise_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('skinwise_token');
      localStorage.removeItem('skinwise_user');
      setToken(null);
      setUser(null);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    return await authApi.changePassword({ currentPassword, newPassword });
  };

  const setHasProfile = (status) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, hasProfile: status };
      localStorage.setItem('skinwise_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        hasProfile: !!user?.hasProfile,
        login,
        register,
        logout,
        changePassword,
        setHasProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
