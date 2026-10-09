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
  loginWithFirebaseGoogle: (directGoogleData?: { email: string; displayName?: string; uid?: string }) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; note?: string; error?: string }>;
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (path: string | null) => void;
  // Admin with Secret Token
  isAdminUnlocked: boolean;
  adminUser: UserProfile | null;
  adminLogin: (secretToken: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  // Admin states
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<UserProfile | null>(null);

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
          if (res.user.role === 'admin' && authService.getAdminToken()) {
            setIsAdminUnlocked(true);
            setAdminUser(res.user);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
          authService.clearToken();
        }
      } catch {
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
    } catch {
      const errorMsg = 'Failed to connect to authentication server.';
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const loginWithFirebaseGoogle = async (directGoogleData?: { email: string; displayName?: string; uid?: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await authService.loginWithFirebaseGoogle(directGoogleData);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true };
      } else {
        const errorMsg = res.error || 'Firebase authentication failed.';
        setAuthError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Firebase sign-in failed.';
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
    } catch {
      const errorMsg = 'Network error during registration.';
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      authService.clearToken();
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsAdminUnlocked(false);
      setAdminUser(null);
    }
  };

  const forgotPassword = async (email: string) => {
    return authService.forgotPassword(email);
  };

  const adminLogin = async (secretToken: string, username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authService.adminLogin(secretToken, username, password);
      if (res.success && res.user) {
        setIsAdminUnlocked(true);
        setAdminUser(res.user);
        return { success: true };
      } else {
        return { success: false, error: res.error || 'Admin verification failed.' };
      }
    } catch {
      return { success: false, error: 'Failed to authenticate admin session.' };
    }
  };

  const adminLogout = async (): Promise<void> => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      authService.clearAdminToken();
      setIsAdminUnlocked(false);
      setAdminUser(null);
    }
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
        loginWithFirebaseGoogle,
        register,
        logout,
        forgotPassword,
        redirectAfterLogin,
        setRedirectAfterLogin,
        isAdminUnlocked,
        adminUser,
        adminLogin,
        adminLogout
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
