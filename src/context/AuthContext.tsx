import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { LoginCredentials, RegisterPayload } from '../types/auth';
import { authService } from '../services/authService';

export interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  isLoading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; note?: string; error?: string }>;
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (path: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  // Initialize and verify existing session token
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const token = authService.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res.success && res.user) {
          setCurrentUser(res.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
          authService.clearToken();
        }
      } catch (err) {
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await authService.login(credentials);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true };
      } else {
        const errorMsg = res.error || 'Invalid email or password.';
        setAuthError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = 'Failed to connect to authentication server.';
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const register = async (payload: RegisterPayload): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await authService.register(payload);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true };
      } else {
        const errorMsg = res.error || 'Failed to create account.';
        setAuthError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = 'Network error during registration.';
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      authService.clearToken();
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const forgotPassword = async (email: string) => {
    return authService.forgotPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isLoading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        forgotPassword,
        redirectAfterLogin,
        setRedirectAfterLogin
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
