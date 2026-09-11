import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../config/api';

const AuthContext = createContext();

const readResponseBody = async (response) => {
  const body = await response.text();
  if (!body) return {};

  try {
    return JSON.parse(body);
  } catch {
    return { message: body.slice(0, 200) || `Request failed with status ${response.status}.` };
  }
};

const isValidToken = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    return !payload.exp || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('env_dash_token');
    if (!isValidToken(storedToken)) {
      localStorage.removeItem('env_dash_token');
      localStorage.removeItem('env_dash_auth');
      return null;
    }
    const saved = localStorage.getItem('env_dash_auth');
    if (saved) {
      try {
        const savedUser = JSON.parse(saved);
        return {
          ...savedUser,
          role: savedUser.role?.toLowerCase() === 'super admin'
            ? 'Super Admin'
            : savedUser.role?.toLowerCase() === 'admin' ? 'Admin' : 'User'
        };
      } catch (e) {
        console.error('Failed to parse auth from localStorage', e);
      }
    }
    return null;
  });
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('env_dash_token');
    return isValidToken(storedToken) ? storedToken : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('env_dash_auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('env_dash_auth');
    }
  }, [user]);

  const login = async (username, password) => {
    let response;
    let result;

    try {
      response = await fetch(apiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      result = await readResponseBody(response);
    } catch {
      throw new Error('Unable to reach the authentication server.');
    }

    if (!response.ok) throw new Error(result.message || 'Login failed.');

    if (!result.user || !result.token) {
      throw new Error('The authentication server returned an incomplete response.');
    }

    const loggedInUser = {
      ...result.user,
      name: result.user.username,
      role: result.user.role.toLowerCase() === 'super admin'
        ? 'Super Admin'
        : result.user.role.toLowerCase() === 'admin' ? 'Admin' : 'User'
    };
    setToken(result.token);
    localStorage.setItem('env_dash_token', result.token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('env_dash_token');
    localStorage.removeItem('env_dash_auth');
  };

  const isAdmin = ['admin', 'super admin'].includes(user?.role?.toLowerCase());

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, isAdmin, token, login, logout }}>
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
