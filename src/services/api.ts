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

export const api = {
  async getSubjects(): Promise<SubjectMetadata[]> {
    const res = await fetch('/api/subjects');
    if (!res.ok) throw new Error('Failed to load subjects');
    return res.json();
  },

  async getQuestions(params?: { subjectId?: string; topic?: string; difficulty?: string; pyqYear?: number; search?: string }): Promise<Question[]> {
    const query = new URLSearchParams();
    if (params?.subjectId) query.set('subjectId', params.subjectId);
    if (params?.topic) query.set('topic', params.topic);
    if (params?.difficulty) query.set('difficulty', params.difficulty);
    if (params?.pyqYear) query.set('pyqYear', params.pyqYear.toString());
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`/api/questions?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load questions');
    return res.json();
  },

  async getQuestionById(id: string): Promise<Question> {
    const res = await fetch(`/api/questions/${id}`);
    if (!res.ok) throw new Error('Question not found');
    return res.json();
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
    const res = await fetch('/api/mock-tests');
    if (!res.ok) throw new Error('Failed to load mock tests');
    return res.json();
  },

  async getMockTestById(id: string): Promise<MockTest & { questions: Question[] }> {
    const res = await fetch(`/api/mock-tests/${id}`);
    if (!res.ok) throw new Error('Failed to load mock test details');
    return res.json();
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
    const res = await fetch('/api/test-attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attempt)
    });
    if (!res.ok) throw new Error('Failed to submit test attempt');
    return res.json();
  },

  async getTestAttempts(): Promise<TestAttemptResult[]> {
    const res = await fetch('/api/test-attempts');
    if (!res.ok) throw new Error('Failed to load test attempts');
    return res.json();
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
    const query = new URLSearchParams();
    if (params?.subjectId) query.set('subjectId', params.subjectId);
    if (params?.category) query.set('category', params.category);
    if (params?.resourceType) query.set('resourceType', params.resourceType);
    if (params?.difficulty) query.set('difficulty', params.difficulty);
    if (params?.year) query.set('year', params.year);
    if (params?.search) query.set('search', params.search);
    if (params?.sortBy) query.set('sortBy', params.sortBy);

    const res = await fetch(`/api/study-materials?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load study materials');
    return res.json();
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
    const query = new URLSearchParams();
    if (category) query.set('category', category);
    if (search) query.set('search', search);

    const res = await fetch(`/api/current-affairs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load current affairs');
    return res.json();
  },

  async getStudyPlan(): Promise<DailyStudyPlan> {
    const res = await fetch('/api/study-plan');
    if (!res.ok) throw new Error('Failed to load study plan');
    return res.json();
  },

  async updateStudyPlan(plan: Partial<DailyStudyPlan>): Promise<DailyStudyPlan> {
    const res = await fetch('/api/study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (!res.ok) throw new Error('Failed to update study plan');
    return res.json();
  },

  async toggleStudyTask(taskId: string): Promise<DailyStudyPlan> {
    const res = await fetch('/api/study-plan/toggle-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId })
    });
    if (!res.ok) throw new Error('Failed to toggle task');
    return res.json();
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const res = await fetch('/api/leaderboard');
    if (!res.ok) throw new Error('Failed to load leaderboard');
    return res.json();
  },

  async getUserProfile(): Promise<UserProfile> {
    const res = await fetch('/api/user/profile');
    if (!res.ok) throw new Error('Failed to load user profile');
    return res.json();
  },

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async toggleBookmark(type: 'question' | 'material', id: string): Promise<{ bookmarked: boolean }> {
    const res = await fetch('/api/user/bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id })
    });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch('/api/notifications');
    if (!res.ok) throw new Error('Failed to load notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<NotificationItem[]> {
    const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to mark notification read');
    return res.json();
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
    const query = new URLSearchParams();
    if (params?.subject) query.set('subject', params.subject);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const res = await fetch(`/api/student/doubts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load student doubts');
    return res.json();
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
    const res = await fetch(`/api/admin/check-access?token=${encodeURIComponent(token)}`);
    return res.json();
  },

  async adminGetSecurityConfig() {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    const res = await fetch('/api/admin/security-config', {
      headers: {
        ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
        ...(secret ? { 'x-secret-token': secret } : {})
      }
    });
    if (!res.ok) throw new Error('Failed to load security config');
    return res.json();
  },

  async adminUpdateSecurityConfig(payload: { secretToken: string; requireTokenInUrl?: boolean }) {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    const res = await fetch('/api/admin/security-config', {
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
      throw new Error(err.error || 'Failed to update security configuration');
    }
    const data = await res.json();
    if (data.config?.secretToken && typeof window !== 'undefined') {
      sessionStorage.setItem('ssc_admin_secret', data.config.secretToken);
    }
    return data;
  },

  async adminGetStudents() {
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
    const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;
    const res = await fetch('/api/admin/students', {
      headers: {
        ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
        ...(secret ? { 'x-secret-token': secret } : {})
      }
    });
    if (!res.ok) throw new Error('Failed to load students');
    return res.json();
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
    const res = await fetch('/api/admin/analytics', {
      headers: {
        ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
        ...(secret ? { 'x-secret-token': secret } : {})
      }
    });
    if (!res.ok) throw new Error('Failed to load admin analytics');
    return res.json();
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

