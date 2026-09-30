import { LoginCredentials, RegisterPayload, AuthResponse } from '../types/auth';
import { UserProfile } from '../types';

const TOKEN_KEY = 'ssc_auth_token';
const REMEMBER_KEY = 'ssc_remember_me';

export const authService = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string, rememberMe = true): void {
    if (typeof window === 'undefined') return;
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_KEY, 'true');
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REMEMBER_KEY);
    }
  },

  clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Invalid email or password.'
        };
      }
      if (data.token) {
        this.setToken(data.token, credentials.rememberMe !== false);
      }
      return data;
    } catch (err: any) {
      return {
        success: false,
        error: 'Unable to connect to the authentication server. Please check your connection.'
      };
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Failed to create account.'
        };
      }
      if (data.token) {
        this.setToken(data.token, true);
      }
      return data;
    } catch (err: any) {
      return {
        success: false,
        error: 'Registration request failed. Please check your network and try again.'
      };
    }
  },

  async getMe(): Promise<{ success: boolean; user?: UserProfile; session?: any; error?: string }> {
    const token = this.getToken();
    if (!token) {
      return { success: false, error: 'No active session token.' };
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        this.clearToken();
        return { success: false, error: data.error || 'Session expired.' };
      }
      return data;
    } catch (err) {
      return { success: false, error: 'Network error checking session.' };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      this.clearToken();
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; note?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.error || 'Failed to submit password reset request.',
          error: data.error
        };
      }
      return data;
    } catch (err) {
      return {
        success: false,
        message: 'Network error requesting password reset. Please try again later.'
      };
    }
  }
};
