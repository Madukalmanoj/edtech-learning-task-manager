import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import api, { setLogoutHandler } from '@/api/client';
import { STORAGE_KEYS } from '@/lib/constants';
import type { AuthUser } from '@/types';

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload extends LoginPayload {
  role: 'student' | 'teacher';
  teacherId?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  authLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setAuthLoading(false);
  }, []);

  const persistSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, nextToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { data } = await api.post('/auth/login', payload);
      persistSession(data.token, data.user);
    },
    [persistSession]
  );

  const signup = useCallback(async (payload: SignupPayload) => {
    await api.post('/auth/signup', payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      authLoading,
      login,
      signup,
      logout,
    }),
    [authLoading, login, logout, signup, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

