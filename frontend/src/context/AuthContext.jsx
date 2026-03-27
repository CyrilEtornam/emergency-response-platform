import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/authApi';
import { setAccessToken, clearAccessToken } from '../api/axiosInstance';
import { getUserFromToken } from '../utils/jwtUtils';
import logger from '../utils/logger';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'INIT_DONE':
      return { ...state, loading: false };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount: check if we have a refresh token and try to restore session
  React.useEffect(() => {
    const storedRefresh = localStorage.getItem('refreshToken');
    if (!storedRefresh) {
      dispatch({ type: 'INIT_DONE' });
      return;
    }
    // Try to refresh the token silently
    import('../api/authApi').then(({ refreshToken }) => {
      refreshToken(storedRefresh)
        .then((data) => {
          const token = data.accessToken || data.access_token;
          setAccessToken(token);
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          const user = getUserFromToken(token);
          dispatch({ type: 'SET_USER', payload: user });
        })
        .catch(() => {
          localStorage.removeItem('refreshToken');
          dispatch({ type: 'INIT_DONE' });
        });
    });
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    const accessToken = data.accessToken || data.access_token;
    const refresh = data.refreshToken || data.refresh_token;

    setAccessToken(accessToken);
    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
    }

    const user = getUserFromToken(accessToken);
    logger.info('User logged in:', user?.email, user?.role);
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    return user;
  }, []);

  const logout = useCallback(async () => {
    const refreshTok = localStorage.getItem('refreshToken');
    try {
      if (refreshTok) await apiLogout(refreshTok);
    } catch {
      // ignore logout API errors
    }
    clearAccessToken();
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
    logger.info('User logged out');
  }, []);

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
