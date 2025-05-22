import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error('Invalid token');
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    const result = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (result.success) {
      setToken(result.data.token);
      localStorage.setItem('token', result.data.token);
      
      try {
        const payload = JSON.parse(atob(result.data.token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error('Error decoding token');
      }
      
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.data?.message || 'Login failed' };
    }
  };

  const signup = async (userData) => {
    const result = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};