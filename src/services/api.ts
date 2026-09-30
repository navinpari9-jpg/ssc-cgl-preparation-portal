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

  async getStudyMaterials(params?: { subjectId?: string; category?: string; search?: string }): Promise<StudyMaterial[]> {
    const query = new URLSearchParams();
    if (params?.subjectId) query.set('subjectId', params.subjectId);
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);

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

  // AI Service Calls
  async askAITutor(query: string, context?: { subject?: string; topic?: string; mode?: string }) {
    const res = await fetch('/api/gemini/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, ...context })
    });
    if (!res.ok) throw new Error('AI Tutor service unavailable');
    return res.json();
  },

  async generateAIQuestions(params: { subject: string; topic: string; difficulty: string; count: number }) {
    const res = await fetch('/api/gemini/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('AI Question Generator unavailable');
    return res.json();
  },

  async analyzePerformance(stats: any) {
    const res = await fetch('/api/gemini/analyze-performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats)
    });
    if (!res.ok) throw new Error('AI Performance Analysis unavailable');
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
        email: payload.email || (payload.asAdmin ? 'admin@sscportal.gov.in' : 'demo@example.com'),
        password: payload.password || (payload.asAdmin ? 'admin123' : 'demo123'),
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
        password: payload.password || 'demo123',
        targetExamYear: payload.targetExamYear || '2026-2027'
      })
    });
    if (!res.ok) throw new Error('Registration failed');
    const data = await res.json();
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('ssc_auth_token', data.token);
    }
    return data;
  }
};
