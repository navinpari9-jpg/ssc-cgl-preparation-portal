import { LoginCredentials, RegisterPayload, AuthResponse } from '../types/auth';
import { UserProfile } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { userSyncManager } from './userSyncManager';

const TOKEN_KEY = 'ssc_auth_token';
const REMEMBER_KEY = 'ssc_remember_me';
const ADMIN_TOKEN_KEY = 'ssc_admin_token';
const ADMIN_SECRET_KEY = 'ssc_admin_secret';

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
    userSyncManager.setCurrentUserInStorage(null);
  },

  getAdminToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
  },

  setAdminToken(token: string, secretToken = 'NKzoro'): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    sessionStorage.setItem(ADMIN_SECRET_KEY, secretToken);
  },

  clearAdminToken(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_SECRET_KEY);
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
      if (data.user) {
        userSyncManager.setCurrentUserInStorage(data.user);
      }
      return data;
    } catch (err: any) {
      // Offline fallback for static deployments (e.g. Vercel static hosting)
      if (credentials.email) {
        const existingProfile = userSyncManager.getUserProfile(credentials.email);
        const fallbackUser: UserProfile = {
          ...existingProfile,
          id: existingProfile.id || 'user-cred-' + Date.now(),
          name: existingProfile.name || credentials.email.split('@')[0] || 'Aspirant',
          email: credentials.email,
          role: 'student'
        };
        const token = 'token-offline-' + Date.now();
        this.setToken(token, credentials.rememberMe !== false);
        userSyncManager.setCurrentUserInStorage(fallbackUser);
        return {
          success: true,
          token,
          user: fallbackUser
        };
      }
      return {
        success: false,
        error: 'Unable to connect to the authentication server. Please check your connection.'
      };
    }
  },

  async loginWithFirebaseGoogle(directGoogleData?: { email: string; displayName?: string; uid?: string }): Promise<AuthResponse> {
    try {
      let uid = '';
      let email = '';
      let displayName = '';

      if (directGoogleData && directGoogleData.email) {
        email = directGoogleData.email.trim();
        displayName = directGoogleData.displayName?.trim() || email.split('@')[0];
        uid = directGoogleData.uid || 'google-' + Math.abs(email.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0));
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        uid = user.uid;
        email = user.email || '';
        displayName = user.displayName || email.split('@')[0] || 'Google Aspirant';
      }

      if (!email) {
        return { success: false, error: 'No email found for Google account.' };
      }

      // Check previously saved data for this Google user to preserve streak, bookmarks, and test scores
      const existingGoogleData = userSyncManager.getUserProfile(email);

      // Sync with server if available
      try {
        const res = await fetch('/api/auth/firebase-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid,
            email,
            displayName
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.token && data.user) {
            this.setToken(data.token, true);
            const mergedUser: UserProfile = {
              ...data.user,
              ...existingGoogleData,
              id: data.user.id || 'google-' + uid,
              name: displayName || data.user.name,
              email: email
            };
            userSyncManager.setCurrentUserInStorage(mergedUser);
            return {
              success: true,
              token: data.token,
              user: mergedUser
            };
          }
        }
      } catch {
        // Fallback for static/offline hosting
      }

      // Offline / Every Domain fallback: Create authenticated Google session with synced data
      const syncedUser: UserProfile = {
        ...existingGoogleData,
        id: 'user-' + uid,
        name: displayName,
        email: email,
        role: 'student',
        targetExamYear: existingGoogleData.targetExamYear || '2026-2027',
        targetTier: existingGoogleData.targetTier || 'Tier-1',
        streak: existingGoogleData.streak || 1,
        lastStreakDate: new Date().toISOString().split('T')[0]
      };
      const token = 'cgl_token_google_' + uid;
      this.setToken(token, true);
      userSyncManager.setCurrentUserInStorage(syncedUser);

      return {
        success: true,
        token,
        user: syncedUser
      };
    } catch (err: any) {
      console.warn('Firebase Auth note:', err);
      const errCode = err.code || '';
      return {
        success: false,
        error: errCode || err.message || 'Firebase Google authentication encountered an error.'
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
      if (data.user) {
        userSyncManager.setCurrentUserInStorage(data.user);
      }
      return data;
    } catch (err: any) {
      // Offline registration support for static hosting
      if (payload.email && payload.name) {
        const newUser: UserProfile = {
          id: 'user-' + Date.now(),
          name: payload.name.trim(),
          email: payload.email.trim(),
          role: 'student',
          targetExamYear: payload.targetExamYear || '2026-2027',
          targetTier: 'Tier-1',
          streak: 1,
          lastStreakDate: new Date().toISOString().split('T')[0],
          totalStudyMinutes: 0,
          questionsSolved: 0,
          correctCount: 0,
          mockTestsCompleted: 0,
          averageScore: 0,
          accuracy: 0,
          bookmarkedQuestionIds: [],
          bookmarkedMaterialIds: [],
          hideFromLeaderboard: false,
          achievements: []
        };
        const token = 'cgl_token_reg_' + Date.now();
        this.setToken(token, true);
        userSyncManager.setCurrentUserInStorage(newUser);
        return {
          success: true,
          token,
          user: newUser
        };
      }
      return {
        success: false,
        error: 'Registration request failed. Please check your network and try again.'
      };
    }
  },

  async adminLogin(secretToken: string, username: string, password: string, rememberMe = true): Promise<any> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretToken, username, password, rememberMe })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Admin verification failed.'
        };
      }
      if (data.token) {
        this.setAdminToken(data.token, secretToken);
      }
      return data;
    } catch (err: any) {
      // Offline fallback for static deployments
      const expectedToken = (typeof window !== 'undefined' ? (sessionStorage.getItem('ssc_admin_secret') || localStorage.getItem('ssc_admin_secret')) : null) || 'NKzoro';
      if (
        secretToken.trim() === expectedToken &&
        (username === 'admin' || username === 'admin@sscportal.gov.in') &&
        (password === 'AdminPass@2026' || password === 'Admin@SSC2026!')
      ) {
        const adminUser = {
          id: 'user-admin',
          name: 'SSC Master Admin',
          email: 'admin@sscportal.gov.in',
          role: 'admin' as const
        };
        const token = 'token-admin-offline';
        this.setAdminToken(token, secretToken);
        return {
          success: true,
          token,
          user: adminUser,
          adminUser
        };
      }
      return {
        success: false,
        error: 'Admin connection error.'
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
        // Only clear token if server explicitly rejected with 401/403
        if (res.status === 401 || res.status === 403) {
          this.clearToken();
          return { success: false, error: data.error || 'Session expired.' };
        }
      } else if (data.user) {
        userSyncManager.setCurrentUserInStorage(data.user);
        return data;
      }
    } catch {
      // Network error or static deployment
    }

    const cachedUser = userSyncManager.getCurrentUserFromStorage();
    if (cachedUser) {
      return {
        success: true,
        user: cachedUser,
        session: { token, email: cachedUser.email }
      };
    }

    return { success: false, error: 'No active session found.' };
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
      this.clearAdminToken();
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
        message: 'Network error. Please try again.',
        error: 'Network connection failed.'
      };
    }
  }
};
