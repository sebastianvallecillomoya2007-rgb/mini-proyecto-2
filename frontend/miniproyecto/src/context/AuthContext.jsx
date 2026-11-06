import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import {
  clearSession,
  getProfile,
  getStoredUser,
  loginUsuario,
  registerUsuario,
} from '../services/clientesService';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('bankToken') || '');
  const [user, setUser] = useState(() => getStoredUser());
  const [isChecking, setIsChecking] = useState(() => Boolean(localStorage.getItem('bankToken')));

  useEffect(() => {
    let active = true;
    const expireSession = () => {
      clearSession();
      setToken('');
      setUser(null);
      setIsChecking(false);
    };

    window.addEventListener('bank:unauthorized', expireSession);

    if (!token) {
      return () => window.removeEventListener('bank:unauthorized', expireSession);
    }

    getProfile()
      .then(({ usuario }) => {
        if (active && usuario) {
          setUser(usuario);
          localStorage.setItem('bankUser', JSON.stringify(usuario));
        }
      })
      .catch(() => {
        if (active) {
          expireSession();
        }
      })
      .finally(() => {
        if (active) {
          setIsChecking(false);
        }
      });

    return () => {
      active = false;
      window.removeEventListener('bank:unauthorized', expireSession);
    };
  }, [token]);

  const saveAuth = (response) => {
    localStorage.setItem('bankToken', response.token);
    localStorage.setItem('bankUser', JSON.stringify(response.usuario));
    setToken(response.token);
    setUser(response.usuario);
    return response;
  };

  const login = async (credentials) => saveAuth(await loginUsuario(credentials));
  const register = async (data) => saveAuth(await registerUsuario(data));
  const logout = () => {
    clearSession();
    setToken('');
    setUser(null);
  };

  const value = { token, user, isChecking, isAuthenticated: Boolean(token && user), login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
