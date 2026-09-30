import { Question, MockTest, StudyMaterial, CurrentAffairItem, TestAttemptResult, UserProfile, DailyStudyPlan, SubjectMetadata } from '../src/types';
import { AuthSession } from '../src/types/auth';
import { SUBJECTS_CATALOG, INITIAL_QUESTIONS, INITIAL_MOCK_TESTS, INITIAL_STUDY_MATERIALS, INITIAL_CURRENT_AFFAIRS, INITIAL_LEADERBOARD, INITIAL_ACHIEVEMENTS, INITIAL_NOTIFICATIONS } from './data';
import crypto from 'crypto';

export interface DatabaseState {
  questions: Question[];
  mockTests: MockTest[];
  studyMaterials: StudyMaterial[];
  currentAffairs: CurrentAffairItem[];
  testAttempts: TestAttemptResult[];
  profile: UserProfile;
  studyPlan: DailyStudyPlan;
}

interface StoredUserAccount {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  salt: string;
  passwordHash: string;
  createdAt: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

const demoStudentSalt = 'cgl_demo_salt_student_2026';
const demoAdminSalt = 'cgl_demo_salt_admin_2026';

const initialAccounts: StoredUserAccount[] = [
  {
    id: 'user-demo',
    email: 'navin.kumar@example.com',
    name: 'Navin Kumar',
    role: 'student',
    salt: demoStudentSalt,
    passwordHash: hashPassword('demo123', demoStudentSalt),
    createdAt: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'user-admin',
    email: 'admin@sscportal.gov.in',
    name: 'SSC CGL Admin',
    role: 'admin',
    salt: demoAdminSalt,
    passwordHash: hashPassword('admin123', demoAdminSalt),
    createdAt: '2026-09-01T00:00:00.000Z'
  }
];

const defaultProfile: UserProfile = {
  id: 'user-demo',
  name: 'Navin Kumar',
  email: 'navin.kumar@example.com',
  role: 'student',
  targetExamYear: '2026-2027',
  targetTier: 'Tier-1',
  streak: 12,
  lastStreakDate: new Date().toISOString().split('T')[0],
  totalStudyMinutes: 3870,
  questionsSolved: 1245,
  correctCount: 1021,
  mockTestsCompleted: 18,
  averageScore: 148.5,
  accuracy: 82.0,
  bookmarkedQuestionIds: ['q-quant-03', 'q-reas-02'],
  bookmarkedMaterialIds: ['mat-quant-formulas'],
  hideFromLeaderboard: false,
  achievements: INITIAL_ACHIEVEMENTS
};

const defaultStudyPlan: DailyStudyPlan = {
  id: 'plan-default',
  examTargetDate: '2026-12-15',
  dailyHours: 3.0,
  level: 'Intermediate',
  strongSubjects: ['reasoning', 'english'],
  weakSubjects: ['quantitative-aptitude', 'general-awareness'],
  weeklyTargetMockTests: 4,
  weeklyTargetQuestions: 300,
  schedule: [
    { id: 'task-1', timeSlot: '09:00 AM - 10:00 AM', subjectId: 'quantitative-aptitude', subjectName: 'Quantitative Aptitude', topic: 'Percentage & Profit-Loss Practice', taskType: 'Practice Drill', durationMinutes: 60, completed: true },
    { id: 'task-2', timeSlot: '10:00 AM - 11:00 AM', subjectId: 'reasoning', subjectName: 'General Intelligence', topic: 'Syllogisms & Number Series', taskType: 'Practice Drill', durationMinutes: 60, completed: true },
    { id: 'task-3', timeSlot: '11:00 AM - 12:00 PM', subjectId: 'english', subjectName: 'English Language', topic: 'Grammar Rules & Vocabulary Roots', taskType: 'Vocab / GK', durationMinutes: 60, completed: false },
    { id: 'task-4', timeSlot: '04:00 PM - 05:00 PM', subjectId: 'general-awareness', subjectName: 'General Awareness', topic: 'Indian Polity & Modern History', taskType: 'Theory / Notes', durationMinutes: 60, completed: false },
    { id: 'task-5', timeSlot: '07:00 PM - 08:00 PM', subjectId: 'quantitative-aptitude', subjectName: 'All Sections', topic: 'Full Tier-1 Mock Test', taskType: 'Mock Test', durationMinutes: 60, completed: false }
  ],
  streakDays: 12,
  lastActiveDate: new Date().toISOString().split('T')[0]
};

class Store {
  private questions: Question[] = [...INITIAL_QUESTIONS];
  private mockTests: MockTest[] = [...INITIAL_MOCK_TESTS];
  private studyMaterials: StudyMaterial[] = [...INITIAL_STUDY_MATERIALS];
  private currentAffairs: CurrentAffairItem[] = [...INITIAL_CURRENT_AFFAIRS];
  private testAttempts: TestAttemptResult[] = [];
  private profile: UserProfile = { ...defaultProfile };
  private studyPlan: DailyStudyPlan = { ...defaultStudyPlan };
  private notifications = [...INITIAL_NOTIFICATIONS];
  private accounts: StoredUserAccount[] = [...initialAccounts];
  private sessions: Map<string, AuthSession> = new Map();

  // Authentication & Session Management
  loginUser(email: string, password: string, rememberMe = true): { success: boolean; user?: UserProfile; token?: string; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Find account by email (or alias 'demo@example.com' for Navin Kumar)
    let account = this.accounts.find(a => a.email.toLowerCase() === normalizedEmail);
    if (!account && (normalizedEmail === 'demo@example.com' || normalizedEmail === 'demo')) {
      account = this.accounts.find(a => a.id === 'user-demo');
    }

    if (!account) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Verify hashed password
    const testHash = hashPassword(password, account.salt);
    if (testHash !== account.passwordHash) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Create session token
    const token = 'cgl_token_' + crypto.randomBytes(32).toString('hex');
    const expiryMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days vs 24 hours
    const expiresAt = new Date(Date.now() + expiryMs).toISOString();

    const session: AuthSession = {
      token,
      userId: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      expiresAt,
      rememberMe
    };

    this.sessions.set(token, session);

    // Synchronize current active profile
    if (account.id === 'user-demo') {
      this.profile = {
        ...this.profile,
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role
      };
    } else {
      this.profile = {
        ...this.profile,
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role
      };
    }

    return {
      success: true,
      token,
      user: this.profile
    };
  }

  registerUser(name: string, email: string, password: string, targetExamYear = '2026-2027'): { success: boolean; user?: UserProfile; token?: string; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = this.accounts.find(a => a.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const newId = 'user-' + Date.now();

    const newAccount: StoredUserAccount = {
      id: newId,
      name: name.trim() || 'Navin Kumar',
      email: normalizedEmail,
      role: 'student',
      salt,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    this.accounts.push(newAccount);

    // Create initial profile for new registrant
    const newProfile: UserProfile = {
      ...defaultProfile,
      id: newId,
      name: newAccount.name,
      email: newAccount.email,
      role: 'student',
      targetExamYear,
      questionsSolved: 0,
      correctCount: 0,
      accuracy: 0,
      mockTestsCompleted: 0,
      streak: 1,
      totalStudyMinutes: 0
    };

    this.profile = newProfile;

    // Issue session token
    const token = 'cgl_token_' + crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const session: AuthSession = {
      token,
      userId: newId,
      email: newAccount.email,
      name: newAccount.name,
      role: 'student',
      expiresAt,
      rememberMe: true
    };

    this.sessions.set(token, session);

    return {
      success: true,
      token,
      user: newProfile
    };
  }

  validateSession(token?: string): AuthSession | null {
    if (!token) return null;
    const session = this.sessions.get(token);
    if (!session) return null;

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      this.sessions.delete(token);
      return null;
    }

    return session;
  }

  destroySession(token?: string): boolean {
    if (!token) return false;
    return this.sessions.delete(token);
  }

  requestPasswordReset(email: string): { success: boolean; message: string; note: string } {
    const normalized = email.trim().toLowerCase();
    const account = this.accounts.find(a => a.email.toLowerCase() === normalized);

    return {
      success: true,
      message: 'Password reset instructions have been sent.',
      note: 'Development notice: Email dispatch simulated. For production delivery, configure SMTP_HOST / SENDGRID_API_KEY environment variables.'
    };
  }

  getSubjects(): SubjectMetadata[] {
    return SUBJECTS_CATALOG;
  }

  getQuestions(filter?: { subjectId?: string; topic?: string; difficulty?: string; pyqYear?: number; search?: string }): Question[] {
    let list = this.questions;
    if (filter?.subjectId) {
      list = list.filter(q => q.subjectId === filter.subjectId);
    }
    if (filter?.topic) {
      list = list.filter(q => q.topic.toLowerCase() === filter.topic!.toLowerCase());
    }
    if (filter?.difficulty) {
      list = list.filter(q => q.difficulty === filter.difficulty);
    }
    if (filter?.pyqYear) {
      list = list.filter(q => q.pyqYear === filter.pyqYear);
    }
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(q => q.question.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s));
    }
    return list;
  }

  getQuestionById(id: string): Question | undefined {
    return this.questions.find(q => q.id === id);
  }

  addQuestion(q: Omit<Question, 'id'>): Question {
    const newQuestion: Question = {
      ...q,
      id: `q-custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    this.questions.unshift(newQuestion);
    return newQuestion;
  }

  updateQuestion(id: string, updates: Partial<Question>): Question | null {
    const idx = this.questions.findIndex(q => q.id === id);
    if (idx === -1) return null;
    this.questions[idx] = { ...this.questions[idx], ...updates };
    return this.questions[idx];
  }

  deleteQuestion(id: string): boolean {
    const idx = this.questions.findIndex(q => q.id === id);
    if (idx === -1) return false;
    this.questions.splice(idx, 1);
    return true;
  }

  getMockTests(): MockTest[] {
    return this.mockTests;
  }

  getMockTestById(id: string): MockTest | undefined {
    return this.mockTests.find(m => m.id === id);
  }

  addMockTest(test: Omit<MockTest, 'id' | 'attemptCount'>): MockTest {
    const newTest: MockTest = {
      ...test,
      id: `mock-custom-${Date.now()}`,
      attemptCount: 0,
      createdAt: new Date().toISOString()
    };
    this.mockTests.unshift(newTest);
    return newTest;
  }

  getStudyMaterials(filter?: { subjectId?: string; topic?: string; category?: string; search?: string }): StudyMaterial[] {
    let list = this.studyMaterials;
    if (filter?.subjectId) {
      list = list.filter(m => m.subjectId === filter.subjectId);
    }
    if (filter?.category) {
      list = list.filter(m => m.category === filter.category);
    }
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(m => m.title.toLowerCase().includes(s) || m.summary.toLowerCase().includes(s) || m.topic.toLowerCase().includes(s));
    }
    return list;
  }

  addStudyMaterial(mat: Omit<StudyMaterial, 'id' | 'updatedAt'>): StudyMaterial {
    const newMat: StudyMaterial = {
      ...mat,
      id: `mat-custom-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    this.studyMaterials.unshift(newMat);
    return newMat;
  }

  getCurrentAffairs(category?: string, search?: string): CurrentAffairItem[] {
    let list = this.currentAffairs;
    if (category && category !== 'All') {
      list = list.filter(c => c.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(s) || c.summary.toLowerCase().includes(s));
    }
    return list;
  }

  addCurrentAffair(item: Omit<CurrentAffairItem, 'id' | 'date'>): CurrentAffairItem {
    const newItem: CurrentAffairItem = {
      ...item,
      id: `ca-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    this.currentAffairs.unshift(newItem);
    return newItem;
  }

  saveTestAttempt(attempt: Omit<TestAttemptResult, 'id'>): TestAttemptResult {
    const result: TestAttemptResult = {
      ...attempt,
      id: `attempt-${Date.now()}`
    };
    this.testAttempts.unshift(result);

    // Update profile stats
    this.profile.mockTestsCompleted += 1;
    this.profile.questionsSolved += attempt.attemptedQuestions;
    this.profile.correctCount += attempt.correctAnswers;
    const totalQuestionsAttempted = this.profile.questionsSolved;
    this.profile.accuracy = totalQuestionsAttempted > 0 
      ? Math.round((this.profile.correctCount / totalQuestionsAttempted) * 1000) / 10 
      : 0;

    // Recalculate average score
    const scores = this.testAttempts.map(a => a.score);
    this.profile.averageScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
    this.profile.totalStudyMinutes += Math.round(attempt.totalTimeSpentSeconds / 60);

    // Update target mock test attempt count
    const mock = this.mockTests.find(m => m.id === attempt.testId);
    if (mock) {
      mock.attemptCount = (mock.attemptCount || 0) + 1;
    }

    return result;
  }

  getTestAttempts(): TestAttemptResult[] {
    return this.testAttempts;
  }

  getProfile(): UserProfile {
    return this.profile;
  }

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    this.profile = { ...this.profile, ...updates };
    return this.profile;
  }

  toggleBookmark(type: 'question' | 'material', id: string): { bookmarked: boolean } {
    if (type === 'question') {
      const idx = this.profile.bookmarkedQuestionIds.indexOf(id);
      if (idx > -1) {
        this.profile.bookmarkedQuestionIds.splice(idx, 1);
        return { bookmarked: false };
      } else {
        this.profile.bookmarkedQuestionIds.push(id);
        return { bookmarked: true };
      }
    } else {
      const idx = this.profile.bookmarkedMaterialIds.indexOf(id);
      if (idx > -1) {
        this.profile.bookmarkedMaterialIds.splice(idx, 1);
        return { bookmarked: false };
      } else {
        this.profile.bookmarkedMaterialIds.push(id);
        return { bookmarked: true };
      }
    }
  }

  getStudyPlan(): DailyStudyPlan {
    return this.studyPlan;
  }

  updateStudyPlan(plan: Partial<DailyStudyPlan>): DailyStudyPlan {
    this.studyPlan = { ...this.studyPlan, ...plan };
    return this.studyPlan;
  }

  toggleTaskCompleted(taskId: string): DailyStudyPlan {
    this.studyPlan.schedule = this.studyPlan.schedule.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    return this.studyPlan;
  }

  getLeaderboard() {
    return INITIAL_LEADERBOARD;
  }

  getNotifications() {
    return this.notifications;
  }

  markNotificationRead(id: string) {
    const item = this.notifications.find(n => n.id === id);
    if (item) item.read = true;
    return this.notifications;
  }
}

export const store = new Store();
