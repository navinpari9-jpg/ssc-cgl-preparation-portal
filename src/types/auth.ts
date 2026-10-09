import { UserProfile } from './index';

export interface LoginCredentials {
  email?: string;
  username?: string;
  identifier?: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  username?: string;
  password: string;
  confirmPassword?: string;
  targetExamYear?: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  email: string;
  username?: string;
  name: string;
  role: 'student' | 'admin';
  expiresAt: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserProfile;
  error?: string;
  message?: string;
}
