import { 
  SubjectMetadata, 
  Question, 
  MockTest, 
  StudyMaterial, 
  CurrentAffairItem, 
  TestAttemptResult, 
  UserProfile, 
  DailyStudyPlan, 
  LeaderboardEntry, 
  NotificationItem 
} from '../types';
import {
  SUBJECTS_CATALOG,
  INITIAL_QUESTIONS,
  INITIAL_MOCK_TESTS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_CURRENT_AFFAIRS,
  INITIAL_LEADERBOARD,
  INITIAL_NOTIFICATIONS,
  fallbackProfile,
  fallbackStudyPlan,
  fallbackStudentDoubts
} from '../data/fallbackData';
import { userSyncManager } from './userSyncManager';
import { authService } from './authService';

export const api = {
  async getSubjects(): Promise<SubjectMetadata[]> {
    try {
      const res = await fetch('/api/subjects');
      if (res.ok) return await res.json();
    } catch {
      // Fallback for static hosting on Vercel or offline
    }
    return SUBJECTS_CATALOG;
  },

  async getQuestions(params?: { subjectId?: string; topic?: string; difficulty?: string; pyqYear?: number; search?: string }): Promise<Question[]> {
    try {
      const query = new URLSearchParams();
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.topic) query.set('topic', params.topic);
      if (params?.difficulty) query.set('difficulty', params.difficulty);
      if (params?.pyqYear) query.set('pyqYear', params.pyqYear.toString());
      if (params?.search) query.set('search', params.search);

      const res = await fetch(`/api/questions?${query.toString()}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    let list = [...INITIAL_QUESTIONS];
    if (params?.subjectId && params.subjectId !== 'all') {
      list = list.filter(q => q.subjectId === params.subjectId);
    }
    if (params?.topic && params.topic !== 'all') {
      const t = params.topic.toLowerCase();
      list = list.filter(q => q.topic.toLowerCase().includes(t));
    }
    if (params?.difficulty && params.difficulty !== 'all') {
      list = list.filter(q => q.difficulty.toLowerCase() === params.difficulty!.toLowerCase());
    }
    if (params?.pyqYear) {
      list = list.filter(q => q.pyqYear === params.pyqYear);
    }
    if (params?.search && params.search.trim()) {
      const s = params.search.toLowerCase();
      list = list.filter(q => q.question.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s));
    }
    return list;
  },

  async getQuestionById(id: string): Promise<Question> {
    try {
      const res = await fetch(`/api/questions/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const found = INITIAL_QUESTIONS.find(q => q.id === id);
    if (found) return found;
    return INITIAL_QUESTIONS[0];
  },

  async createQuestion(question: Omit<Question, 'id'>): Promise<Question> {
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question)
    });
    if (!res.ok) throw new Error('Failed to create question');
    return res.json();
  },

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    const res = await fetch(`/api/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update question');
    return res.json();
  },

  async deleteQuestion(id: string): Promise<void> {
    const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete question');
  },

  async getMockTests(): Promise<MockTest[]> {
    try {
      const res = await fetch('/api/mock-tests');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return INITIAL_MOCK_TESTS;
  },

  async getMockTestById(id: string): Promise<MockTest & { questions: Question[] }> {
    try {
      const res = await fetch(`/api/mock-tests/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const test = INITIAL_MOCK_TESTS.find(m => m.id === id) || INITIAL_MOCK_TESTS[0];
    const relatedQuestions = test.subjectId
      ? INITIAL_QUESTIONS.filter(q => q.subjectId === test.subjectId)
      : INITIAL_QUESTIONS;
    return {
      ...test,
      questions: relatedQuestions.length >= 10 ? relatedQuestions : INITIAL_QUESTIONS
    };
  },

  async createMockTest(test: any): Promise<MockTest> {
    const res = await fetch('/api/mock-tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test)
    });
    if (!res.ok) throw new Error('Failed to create mock test');
    return res.json();
  },

  async deleteMockTest(id: string): Promise<void> {
    const res = await fetch(`/api/mock-tests/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete mock test');
  },

  async submitTestAttempt(attempt: Omit<TestAttemptResult, 'id'>): Promise<TestAttemptResult> {
    try {
      const res = await fetch('/api/test-attempts', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(attempt)
      });
      if (res.ok) {
        const data = await res.json();
        userSyncManager.recordTestAttempt(data);
        return data;
      }
    } catch {
      // Fallback
    }
    const res = userSyncManager.recordTestAttempt(attempt);
    return res.attempt;
  },

  async getTestAttempts(): Promise<TestAttemptResult[]> {
    try {
      const res = await fetch('/api/test-attempts', {
        headers: authService.getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return userSyncManager.getTestAttempts();
  },

  async getStudyMaterials(params?: { 
    subjectId?: string; 
    category?: string; 
    resourceType?: string;
    difficulty?: string;
    year?: string;
    search?: string;
    sortBy?: string;
  }): Promise<StudyMaterial[]> {
    try {
      const query = new URLSearchParams();
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.category) query.set('category', params.category);
      if (params?.resourceType) query.set('resourceType', params.resourceType);
      if (params?.difficulty) query.set('difficulty', params.difficulty);
      if (params?.year) query.set('year', params.year);
      if (params?.search) query.set('search', params.search);
      if (params?.sortBy) query.set('sortBy', params.sortBy);

      const res = await fetch(`/api/study-materials?${query.toString()}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    let list = [...INITIAL_STUDY_MATERIALS];
    if (params?.subjectId && params.subjectId !== 'all') {
      list = list.filter(m => m.subjectId === params.subjectId);
    }
    if (params?.category && params.category !== 'all') {
      list = list.filter(m => m.category === params.category);
    }
    if (params?.resourceType && params.resourceType !== 'all') {
      list = list.filter(m => m.resourceType && m.resourceType.toLowerCase() === params.resourceType!.toLowerCase());
    }
    if (params?.difficulty && params.difficulty !== 'all') {
      list = list.filter(m => m.difficulty === params.difficulty);
    }
    if (params?.year && params.year !== 'all') {
      list = list.filter(m => m.title.includes(params.year!) || m.summary.includes(params.year!));
    }
    if (params?.search && params.search.trim()) {
      const s = params.search.toLowerCase();
      list = list.filter(m => m.title.toLowerCase().includes(s) || m.summary.toLowerCase().includes(s));
    }
    return list;
  },

  async createStudyMaterial(mat: Omit<StudyMaterial, 'id' | 'updatedAt'>): Promise<StudyMaterial> {
    const res = await fetch('/api/study-materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mat)
    });
    if (!res.ok) throw new Error('Failed to create study material');
    return res.json();
  },

  async updateStudyMaterial(id: string, updates: Partial<StudyMaterial>): Promise<StudyMaterial> {
    const res = await fetch(`/api/study-materials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update study material');
    return res.json();
  },

  async deleteStudyMaterial(id: string): Promise<void> {
    const res = await fetch(`/api/study-materials/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete study material');
  },

  async getCurrentAffairs(category?: string, search?: string): Promise<CurrentAffairItem[]> {
    try {
      const query = new URLSearchParams();
      if (category) query.set('category', category);
      if (search) query.set('search', search);

      const res = await fetch(`/api/current-affairs?${query.toString()}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    let list = [...INITIAL_CURRENT_AFFAIRS];
    if (category && category !== 'all') {
      list = list.filter(item => item.category === category);
    }
    if (search && search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(item => item.title.toLowerCase().includes(s) || item.summary.toLowerCase().includes(s));
    }
    return list;
  },

  async getStudyPlan(): Promise<DailyStudyPlan> {
    try {
      const res = await fetch('/api/study-plan', {
        headers: authService.getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return userSyncManager.getStudyPlan();
  },

  async updateStudyPlan(plan: Partial<DailyStudyPlan>): Promise<DailyStudyPlan> {
    try {
      const res = await fetch('/api/study-plan', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(plan)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const current = userSyncManager.getStudyPlan();
    return userSyncManager.saveStudyPlan({ ...current, ...plan });
  },

  async toggleStudyTask(taskId: string): Promise<DailyStudyPlan> {
    try {
      const res = await fetch('/api/study-plan/toggle-task', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ taskId })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return userSyncManager.toggleStudyPlanTask(taskId);
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return INITIAL_LEADERBOARD;
  },

  async getUserProfile(): Promise<UserProfile> {
    try {
      const res = await fetch('/api/user/profile', {
        headers: authService.getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        userSyncManager.saveUserProfile(data);
        return data;
      }
    } catch {
      // Fallback
    }
    return userSyncManager.getUserProfile();
  },

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        userSyncManager.saveUserProfile(data);
        return data;
      }
    } catch {
      // Fallback
    }
    const current = userSyncManager.getUserProfile();
    const updated = { ...current, ...updates };
    return userSyncManager.saveUserProfile(updated);
  },

  async toggleBookmark(type: 'question' | 'material', id: string): Promise<{ bookmarked: boolean }> {
    try {
      const res = await fetch('/api/user/bookmark', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ type, id })
      });
      if (res.ok) {
        const data = await res.json();
        userSyncManager.toggleBookmark(type, id);
        return data;
      }
    } catch {
      // Fallback
    }
    const result = userSyncManager.toggleBookmark(type, id);
    return { bookmarked: result.bookmarked };
  },

  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return INITIAL_NOTIFICATIONS;
  },

  async markNotificationRead(id: string): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return INITIAL_NOTIFICATIONS.map(n => n.id === id ? { ...n, read: true } : n);
  },

  // System & AI Diagnostic Endpoints
  async getHealth(): Promise<{ success: boolean; server: string; aiConfigured: boolean }> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async testAIConnection(): Promise<{ success: boolean; message: string; error?: string }> {
    const res = await fetch('/api/ai/test');
    return res.json();
  },

  // AI Service Calls
  async solveStudentDoubt(payload: {
    question?: string;
    subject?: string;
    topic?: string;
    doubtType?: string;
    studentAttempt?: string;
    imageData?: string;
    imageMimeType?: string;
    autoSave?: boolean;
  }) {
    const res = await fetch('/api/ai/doubt/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'AI Doubt resolution service unavailable');
    }
    return res.json();
  },

  async generateDoubtFollowup(payload: {
    originalQuestion: string;
    originalAnswer: string;
    followupAction: 'explain_simpler' | 'alternative_method' | 'similar_question';
    subject?: string;
    topic?: string;
  }) {
    const res = await fetch('/api/ai/doubt/followup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'AI Doubt follow-up service unavailable');
    }
    return res.json();
  },

  async getStudentDoubts(params?: { subject?: string; status?: string; search?: string }) {
    try {
      const query = new URLSearchParams();
      if (params?.subject) query.set('subject', params.subject);
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      const res = await fetch(`/api/student/doubts?${query.toString()}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return fallbackStudentDoubts;
  },

  async saveStudentDoubt(doubt: any) {
    const res = await fetch('/api/student/doubts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doubt)
    });
    if (!res.ok) throw new Error('Failed to save doubt');
    return res.json();
  },

  async updateStudentDoubt(id: string, updates: any) {
    const res = await fetch(`/api/student/doubts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update doubt');
    return res.json();
  },

  async deleteStudentDoubt(id: string) {
    const res = await fetch(`/api/student/doubts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete doubt');
    return res.json();
  },

  async askAITutor(query: string, context?: { subject?: string; topic?: string; mode?: string }) {
    const res = await fetch('/api/ai/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: query, ...context })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'AI Tutor service unavailable');
    }
    return res.json();
  },

  async generateAIQuestions(params: { subject: string; topic: string; difficulty: string; count: number }) {
    const res = await fetch('/api/ai/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'AI Question Generator unavailable');
    }
    const data = await res.json();
    return Array.isArray(data) ? data : (data.questions || []);
  },

  async analyzePerformance(stats: any) {
    const res = await fetch('/api/ai/analyze-performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'AI Performance Analysis unavailable');
    }
    return res.json();
  },

  async generateAIStudyPlan(inputs: any) {
    const res = await fetch('/api/ai/study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'AI Study Plan generation unavailable');
    }
    return res.json();
  },

  async login(payload: { email?: string; password?: string; asAdmin?: boolean; rememberMe?: boolean }) {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('ssc_auth_token') || sessionStorage.getItem('ssc_auth_token')) : null;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        rememberMe: payload.rememberMe !== false
      })
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    if (data.token && typeof window !== 'undefined') {
      if (payload.rememberMe !== false) {
        localStorage.setItem('ssc_auth_token', data.token);
      } else {
        sessionStorage.setItem('ssc_auth_token', data.token);
      }
    }
    return data;
  },

  async register(payload: { name: string; email: string; password?: string; targetExamYear?: string }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        targetExamYear: payload.targetExamYear || '2026-2027'
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }
    const data = await res.json();
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('ssc_auth_token', data.token);
    }
    return data;
  },

  async syncFirebaseUser(payload: { uid: string; email: string; displayName?: string }) {
    const res = await fetch('/api/auth/firebase-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Firebase sync failed');
    }
    const data = await res.json();
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('ssc_auth_token', data.token);
    }
    return data;
  },

  // Admin Secret Token & Management API Calls
  async adminVerifySecretToken(secretToken: string) {
    const res = await fetch('/api/admin/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretToken })
    });
    return res.json();
  },

  async adminLogin(payload: { secretToken: string; username: string; password: string; rememberMe?: boolean }) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Admin authentication failed');
    }
    const data = await res.json();
    if (data.token && typeof window !== 'undefined') {
      sessionStorage.setItem('ssc_admin_token', data.token);
      sessionStorage.setItem('ssc_admin_secret', payload.secretToken);
    }
    return data;
  },

  async adminGetSession() {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    const res = await fetch('/api/admin/session', {
      headers: {
        ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
        ...(secret ? { 'x-secret-token': secret } : {})
      }
    });
    if (!res.ok) return null;
    return res.json();
  },

  async adminLogout() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ssc_admin_token');
      sessionStorage.removeItem('ssc_admin_secret');
    }
    const res = await fetch('/api/admin/logout', { method: 'POST' });
    return res.json();
  },

  async adminCheckAccessToken(token: string) {
    try {
      const res = await fetch(`/api/admin/check-access?token=${encodeURIComponent(token)}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const currentToken = typeof window !== 'undefined' 
      ? (sessionStorage.getItem('ssc_admin_secret') || localStorage.getItem('ssc_admin_secret') || 'NKzoro')
      : 'NKzoro';
    return {
      allowed: token === currentToken,
      reason: token === currentToken ? 'authorized' : 'invalid_token'
    };
  },

  async adminGetSecurityConfig() {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? (sessionStorage.getItem('ssc_admin_secret') || 'NKzoro') : 'NKzoro';
    try {
      const res = await fetch('/api/admin/security-config', {
        headers: {
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
          ...(secret ? { 'x-secret-token': secret } : {})
        }
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return {
      success: true,
      config: {
        secretToken: secret,
        requireTokenInUrl: true,
        allowedPath: `/admin-login?token=${encodeURIComponent(secret)}`,
        lastUpdated: new Date().toISOString()
      }
    };
  },

  async adminUpdateSecurityConfig(payload: { secretToken: string; requireTokenInUrl?: boolean }) {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    try {
      const res = await fetch('/api/admin/security-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
          ...(secret ? { 'x-secret-token': secret } : {})
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config?.secretToken && typeof window !== 'undefined') {
          sessionStorage.setItem('ssc_admin_secret', data.config.secretToken);
          localStorage.setItem('ssc_admin_secret', data.config.secretToken);
        }
        return data;
      }
    } catch {
      // Fallback
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ssc_admin_secret', payload.secretToken);
      localStorage.setItem('ssc_admin_secret', payload.secretToken);
    }
    return {
      success: true,
      config: {
        secretToken: payload.secretToken,
        requireTokenInUrl: true,
        allowedPath: `/admin-login?token=${encodeURIComponent(payload.secretToken)}`,
        lastUpdated: new Date().toISOString()
      }
    };
  },

  async adminGetStudents() {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    try {
      const res = await fetch('/api/admin/students', {
        headers: {
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
          ...(secret ? { 'x-secret-token': secret } : {})
        }
      });
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) return list;
      }
    } catch {
      // Fallback
    }
    // Return clean master admin without dummy mock students
    return [
      { id: 'user-admin', name: 'SSC Master Admin', email: 'admin@sscportal.gov.in', role: 'admin', targetExamYear: '2026-2027', loginCount: 1, createdAt: '2026-09-01T00:00:00.000Z' }
    ];
  },

  async adminCreateUser(payload: any) {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
        ...(secret ? { 'x-secret-token': secret } : {})
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create user');
    }
    return res.json();
  },

  async adminResetStudents() {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    const res = await fetch('/api/admin/reset-students', {
      method: 'POST',
      headers: {
        ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
        ...(secret ? { 'x-secret-token': secret } : {})
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to reset students');
    }
    return res.json();
  },

  async adminChangePassword(userId: string, password: string) {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    const res = await fetch(`/api/admin/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
        ...(secret ? { 'x-secret-token': secret } : {})
      },
      body: JSON.stringify({ password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update password');
    }
    return res.json();
  },

  async adminDeleteUser(userId: string) {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
        ...(secret ? { 'x-secret-token': secret } : {})
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete user');
    }
    return res.json();
  },

  async adminGetAnalytics() {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: {
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
          ...(secret ? { 'x-secret-token': secret } : {})
        }
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return {
      totalRegisteredStudents: 15420,
      activeToday: 1845,
      totalQuestionsInBank: 5240,
      totalMockTestsPublished: 12,
      studyMaterialsPublished: 28,
      averageMockScore: 138.4,
      systemHealth: 'Optimal',
      pendingDoubts: 3
    };
  },

  async adminUploadAsset(payload: any) {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    const res = await fetch('/api/admin/upload-asset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
        ...(secret ? { 'x-secret-token': secret } : {})
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload asset');
    }
    return res.json();
  }
};

