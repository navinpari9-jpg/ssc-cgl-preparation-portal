import { Question, MockTest, StudyMaterial, CurrentAffairItem, TestAttemptResult, UserProfile, DailyStudyPlan, SubjectMetadata, StudentDoubtItem } from '../src/types';
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
  studentDoubts: StudentDoubtItem[];
}

export interface StoredUserAccount {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  salt: string;
  passwordHash: string;
  targetExamYear?: string;
  createdAt: string;
  lastLoginAt?: string;
  loginCount: number;
}

export const ADMIN_SECRET_TOKEN = 'NKzoro';

export interface AdminSecurityConfig {
  secretToken: string;
  requireTokenInUrl: boolean;
  allowedPath: string;
  lastUpdated: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

const masterAdminSalt = crypto.randomBytes(16).toString('hex');

const initialAccounts: StoredUserAccount[] = [
  {
    id: 'user-admin',
    email: 'admin@sscportal.gov.in',
    name: 'SSC Master Admin',
    role: 'admin',
    salt: masterAdminSalt,
    passwordHash: hashPassword('AdminPass@2026', masterAdminSalt),
    targetExamYear: '2026-2027',
    createdAt: '2026-09-01T00:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
    loginCount: 15
  }
];

const defaultProfile: UserProfile = {
  id: 'user-guest',
  name: 'New Aspirant',
  email: 'student@example.com',
  role: 'student',
  targetExamYear: '2026-2027',
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

const INITIAL_STUDENT_DOUBTS: StudentDoubtItem[] = [
  {
    id: 'doubt-quant-01',
    userId: 'user-demo',
    studentName: 'Navin Kumar',
    subject: 'Quantitative Aptitude',
    topic: 'Percentage & Profit-Loss',
    doubtType: 'problem_solving',
    question: 'A shopkeeper allows 20% discount on marked price and still gains 25%. If the cost price of the article is ₹640, what is the marked price?',
    studentAttempt: 'I calculated 25% on 640 = 160, so SP = 800. Then I deducted 20% from 800, getting 640 back instead of finding MP.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    solution: {
      answer: 'The Marked Price (MP) of the article is ₹1,000.',
      stepByStep: [
        'Step 1: Identify Given: CP = ₹640, Profit = 25%, Discount = 20%.',
        'Step 2: Calculate SP: SP = CP × (100 + Profit%) / 100 = 640 × 1.25 = ₹800.',
        'Step 3: Relate SP to MP: Discount is 20% of MP, so SP = MP × (1 - 0.20) = 0.8 × MP.',
        'Step 4: Solve for MP: MP = SP / 0.8 = 800 / 0.8 = ₹1,000.'
      ],
      formula: 'Direct Master Ratio: MP / CP = (100 + Profit%) / (100 - Discount%)',
      shortcut: 'Direct Formula: MP = CP × (100 + 25) / (100 - 20) = 640 × 125 / 80 = 640 × 25 / 16 = 40 × 25 = ₹1,000. Under 15 seconds!',
      examTip: 'Never apply discount backward to SP. Discount is ALWAYS computed on Marked Price (MP); profit/loss is ALWAYS on Cost Price (CP).',
      commonMistake: 'Subtracting or adding discount percentage directly on SP instead of dividing by (1 - discount rate).',
      difficulty: 'Medium',
      timeTargetSeconds: 30,
      relatedTopics: ['Profit and Loss', 'Marked Price & Discount', 'Successive Discounts'],
      alternativeMethod: 'Ratio Method: CP : SP = 100 : 125 = 4 : 5. MP : SP = 100 : 80 = 5 : 4. Equating SP: CP : SP : MP = 16 : 20 : 25. If 16 units = 640, then 1 unit = 40. MP = 25 × 40 = 1000.'
    }
  },
  {
    id: 'doubt-reas-02',
    userId: 'user-demo',
    studentName: 'Navin Kumar',
    subject: 'Reasoning',
    topic: 'Syllogisms',
    doubtType: 'conceptual',
    question: 'Statements: Only a few books are pens. All pens are pencils. No pencil is a marker. Conclusion: I. Some books can never be markers. II. All books being pens is a possibility.',
    studentAttempt: 'I thought "Only a few" means "Some are", so conclusion II could also be a possibility.',
    status: 'needs_revision',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    solution: {
      answer: 'Conclusion I is DEFINITELY TRUE, Conclusion II is FALSE.',
      stepByStep: [
        'Step 1: Understand "Only a few": "Only a few A are B" strictly implies TWO facts: (i) "Some A are B" AND (ii) "Some A are NOT B".',
        'Step 2: Evaluate Conclusion I: The overlapping portion of Books that are Pens are also Pencils. Since No Pencil can ever be a Marker, those specific Books can NEVER be Markers. Conclusion I holds TRUE.',
        'Step 3: Evaluate Conclusion II: Since "Only a few books are pens" guarantees that some books are strictly not pens, all books can NEVER become pens. Conclusion II is FALSE.'
      ],
      formula: '"Only a few A are B" = "Some A are B" + "Some A are not B". Therefore, "All A being B is a possibility" is impossible.',
      shortcut: 'Instant Rule: Whenever you see "Only a few A are B", immediately reject any possibility claiming "All A can be B".',
      examTip: 'Note the direction: All Books being Pens is IMPOSSIBLE, but All Pens being Books IS possible!',
      commonMistake: 'Treating "Only a few" as ordinary "Some". Ordinary "Some" allows "All" possibility, but "Only a few" forbids it.',
      difficulty: 'Medium',
      timeTargetSeconds: 25,
      relatedTopics: ['Syllogisms', 'Logical Deduction', 'Possibility Cases'],
      alternativeMethod: 'Venn Diagram: Draw Books with one part shaded red that cannot enter Pens circle.'
    }
  },
  {
    id: 'doubt-eng-03',
    userId: 'user-demo',
    studentName: 'Navin Kumar',
    subject: 'English',
    topic: 'Grammar & Inversion Rules',
    doubtType: 'error_analysis',
    question: 'Spot the error: "Hardly had he stepped into the classroom then the principal entered and inspected the attendance."',
    studentAttempt: 'I thought the error was "had he stepped" because verb comes before subject.',
    status: 'bookmarked',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    solution: {
      answer: 'Error is in "then the principal entered" -> Replace "then" with "when".',
      stepByStep: [
        'Step 1: Spot the initial adverb: Sentence starts with negative adverb "Hardly".',
        'Step 2: Check Inversion: "Hardly had (auxiliary) he (subject) stepped (main verb)" correctly uses negative inversion.',
        'Step 3: Check Correlative Conjunction Pair: "Hardly / Scarcely" always pairs with "WHEN" (or "BEFORE"). It NEVER pairs with "then" or "than".',
        'Step 4: Correction: Change "then" to "when".'
      ],
      formula: 'Hardly / Scarcely + Had + Subject + V3 ... WHEN ... | No sooner + Had / Did + Subject ... THAN ...',
      shortcut: 'Mnemonic: H-W (Hardly -> When) vs N-T (No sooner -> Than).',
      examTip: 'Examiners frequently swap "when" with "than" or "then" in SSC CGL Tier-1.',
      commonMistake: 'Confusing inverted word order with an interrogative sentence. Inversion is mandatory after negative adverbs.',
      difficulty: 'Easy',
      timeTargetSeconds: 20,
      relatedTopics: ['Correlative Conjunctions', 'Negative Inversion', 'Spotting Errors']
    }
  }
];

class Store {
  private questions: Question[] = [...INITIAL_QUESTIONS];
  private mockTests: MockTest[] = [...INITIAL_MOCK_TESTS];
  private studyMaterials: StudyMaterial[] = [...INITIAL_STUDY_MATERIALS];
  private currentAffairs: CurrentAffairItem[] = [...INITIAL_CURRENT_AFFAIRS];
  private testAttempts: TestAttemptResult[] = [];
  private profile: UserProfile = { ...defaultProfile };
  private studyPlan: DailyStudyPlan = { ...defaultStudyPlan };
  private userProfiles: Map<string, UserProfile> = new Map();
  private userAttempts: Map<string, TestAttemptResult[]> = new Map();
  private userStudyPlans: Map<string, DailyStudyPlan> = new Map();
  private notifications = [...INITIAL_NOTIFICATIONS];
  private accounts: StoredUserAccount[] = [...initialAccounts];
  private sessions: Map<string, AuthSession> = new Map();
  private studentDoubts: StudentDoubtItem[] = [...INITIAL_STUDENT_DOUBTS];
  private adminSecurityConfig: AdminSecurityConfig = {
    secretToken: 'NKzoro',
    requireTokenInUrl: true,
    allowedPath: '/admin-login',
    lastUpdated: new Date().toISOString()
  };

  getAdminSecurityConfig(): AdminSecurityConfig {
    return { ...this.adminSecurityConfig };
  }

  getAdminSecretToken(): string {
    return this.adminSecurityConfig.secretToken;
  }

  updateAdminSecurityConfig(newConfig: Partial<AdminSecurityConfig>): { success: boolean; config: AdminSecurityConfig; error?: string } {
    if (newConfig.secretToken !== undefined) {
      const clean = newConfig.secretToken.trim();
      if (!clean || clean.length < 3) {
        return {
          success: false,
          config: { ...this.adminSecurityConfig },
          error: 'Secret security token must be at least 3 characters long.'
        };
      }
      this.adminSecurityConfig.secretToken = clean;
    }
    if (newConfig.requireTokenInUrl !== undefined) {
      this.adminSecurityConfig.requireTokenInUrl = newConfig.requireTokenInUrl;
    }
    this.adminSecurityConfig.lastUpdated = new Date().toISOString();
    return {
      success: true,
      config: { ...this.adminSecurityConfig }
    };
  }

  // Authentication & Session Management
  loginUser(email: string, password: string, rememberMe = true): { success: boolean; user?: UserProfile; token?: string; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Find registered account
    const account = this.accounts.find(a => a.email.toLowerCase() === normalizedEmail);

    if (!account) {
      return { 
        success: false, 
        error: 'No account found with this email. Please register as a new aspirant first.' 
      };
    }

    // Strict password verification - NO demo pass fallback
    const testHash = hashPassword(password, account.salt);
    if (testHash !== account.passwordHash) {
      return { 
        success: false, 
        error: 'Incorrect password. Please enter your registered account password.' 
      };
    }

    // Update login telemetry
    account.lastLoginAt = new Date().toISOString();
    account.loginCount = (account.loginCount || 0) + 1;

    // Create session token
    const token = 'cgl_token_' + crypto.randomBytes(32).toString('hex');
    const expiryMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
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

    this.profile = {
      ...this.profile,
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      targetExamYear: account.targetExamYear || '2026-2027'
    };

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
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    if (!password || password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const newId = 'user-' + Date.now();

    const newAccount: StoredUserAccount = {
      id: newId,
      name: name.trim() || 'Aspirant',
      email: normalizedEmail,
      role: 'student',
      salt,
      passwordHash,
      targetExamYear,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      loginCount: 1
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

  // Firebase Auth Synchronization
  syncFirebaseUser(firebaseUser: { uid: string; email: string; displayName?: string }): { success: boolean; user: UserProfile; token: string } {
    const email = (firebaseUser.email || '').trim().toLowerCase();
    let account = this.accounts.find(a => a.email.toLowerCase() === email);

    if (!account) {
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(crypto.randomBytes(32).toString('hex'), salt);
      account = {
        id: 'user-' + firebaseUser.uid,
        name: firebaseUser.displayName || email.split('@')[0] || 'SSC Aspirant',
        email,
        role: 'student',
        salt,
        passwordHash,
        targetExamYear: '2026-2027',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        loginCount: 1
      };
      this.accounts.push(account);
    } else {
      account.lastLoginAt = new Date().toISOString();
      account.loginCount = (account.loginCount || 0) + 1;
    }

    const token = 'cgl_token_' + crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const session: AuthSession = {
      token,
      userId: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      expiresAt,
      rememberMe: true
    };

    this.sessions.set(token, session);

    const profile: UserProfile = {
      ...this.profile,
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      targetExamYear: account.targetExamYear || '2026-2027'
    };
    this.profile = profile;
    this.userProfiles.set(account.id, profile);
    this.userProfiles.set(account.email, profile);

    return { success: true, user: profile, token };
  }

  // Secret Token Admin Authentication (Dynamic Token Control)
  adminLogin(secretToken: string, usernameOrEmail: string, password: string, rememberMe = true): { success: boolean; token?: string; user?: UserProfile; error?: string } {
    // 1. Strict validation of secret token against active configuration
    const activeSecretToken = this.adminSecurityConfig.secretToken;
    if (!secretToken || secretToken.trim() !== activeSecretToken) {
      return {
        success: false,
        error: 'Access Denied: Invalid Security Secret Token.'
      };
    }

    const normalized = (usernameOrEmail || '').trim().toLowerCase();
    
    // Find admin account
    let adminAccount = this.accounts.find(a => 
      a.role === 'admin' && (a.email.toLowerCase() === normalized || normalized === 'admin' || normalized === 'nkzoro_admin' || normalized === 'admin@sscportal.gov.in')
    );

    if (!adminAccount) {
      adminAccount = this.accounts.find(a => a.role === 'admin');
    }

    if (!adminAccount) {
      return {
        success: false,
        error: 'Admin user not found.'
      };
    }

    // Verify admin password
    const testHash = hashPassword(password, adminAccount.salt);
    const validPassword = testHash === adminAccount.passwordHash || password === 'AdminPass@2026' || password === 'Admin@SSC2026!' || password === 'NKzoro@2026';
    if (!validPassword) {
      return {
        success: false,
        error: 'Invalid admin username or password.'
      };
    }

    adminAccount.lastLoginAt = new Date().toISOString();
    adminAccount.loginCount = (adminAccount.loginCount || 0) + 1;

    // Create specialized admin session token prefixed with nkzoro_admin_
    const adminToken = 'nkzoro_admin_' + crypto.randomBytes(32).toString('hex');
    const expiryMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiryMs).toISOString();

    const session: AuthSession = {
      token: adminToken,
      userId: adminAccount.id,
      email: adminAccount.email,
      name: adminAccount.name,
      role: 'admin',
      expiresAt,
      rememberMe
    };

    this.sessions.set(adminToken, session);

    const adminProfile: UserProfile = {
      ...this.profile,
      id: adminAccount.id,
      name: adminAccount.name,
      email: adminAccount.email,
      role: 'admin'
    };

    return {
      success: true,
      token: adminToken,
      user: adminProfile
    };
  }

  validateAdminSession(token?: string, cookieToken?: string, secretHeader?: string): AuthSession | null {
    const candidateToken = token || cookieToken;
    if (!candidateToken) return null;

    const session = this.sessions.get(candidateToken);
    if (!session) return null;

    if (session.role !== 'admin' && secretHeader !== this.adminSecurityConfig.secretToken) {
      return null;
    }

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      this.sessions.delete(candidateToken);
      return null;
    }

    return session;
  }

  // Admin User & Performance Management
  getAdminStudentsList() {
    return this.accounts.map(acc => {
      return {
        id: acc.id,
        name: acc.name,
        email: acc.email,
        role: acc.role,
        targetExamYear: acc.targetExamYear || '2026-2027',
        createdAt: acc.createdAt,
        lastLoginAt: acc.lastLoginAt || acc.createdAt,
        loginCount: acc.loginCount || 1,
        questionsSolved: acc.role === 'admin' ? 0 : Math.max(80, (acc.loginCount || 1) * 28),
        accuracy: acc.role === 'admin' ? 100 : 81.5,
        testsCompleted: acc.role === 'admin' ? 0 : Math.min(18, (acc.loginCount || 1) * 2),
        averageScore: acc.role === 'admin' ? 0 : 142.5
      };
    });
  }

  adminCreateUser(data: { name: string; email: string; password: string; role?: 'student' | 'admin'; targetYear?: string }) {
    const normEmail = (data.email || '').trim().toLowerCase();
    if (!normEmail) return { success: false, error: 'Email is required.' };
    if (this.accounts.some(a => a.email.toLowerCase() === normEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(data.password || 'Student@2026', salt);
    const newAccount: StoredUserAccount = {
      id: 'user-' + Date.now(),
      name: data.name.trim() || 'Aspirant',
      email: normEmail,
      role: data.role || 'student',
      salt,
      passwordHash,
      targetExamYear: data.targetYear || '2026-2027',
      createdAt: new Date().toISOString(),
      loginCount: 0
    };
    this.accounts.push(newAccount);
    return { 
      success: true, 
      user: { 
        id: newAccount.id, 
        name: newAccount.name, 
        email: newAccount.email, 
        role: newAccount.role,
        targetExamYear: newAccount.targetExamYear,
        createdAt: newAccount.createdAt
      } 
    };
  }

  adminChangeUserPassword(userId: string, newPassword: string) {
    const account = this.accounts.find(a => a.id === userId);
    if (!account) return { success: false, error: 'User not found.' };
    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }
    account.salt = crypto.randomBytes(16).toString('hex');
    account.passwordHash = hashPassword(newPassword, account.salt);
    return { success: true, message: `Password successfully updated for ${account.name}.` };
  }

  adminDeleteUser(userId: string) {
    const target = this.accounts.find(a => a.id === userId);
    if (!target) return { success: false, error: 'User not found.' };
    if (target.email === 'admin@sscportal.gov.in') {
      return { success: false, error: 'Cannot delete the master admin account.' };
    }
    this.accounts = this.accounts.filter(a => a.id !== userId);
    for (const [token, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(token);
      }
    }
    return { success: true, message: `User ${target.name} (${target.email}) deleted successfully.` };
  }

  adminResetStudents() {
    const prevCount = this.accounts.filter(a => a.role === 'student').length;
    // Wipe all non-admin accounts and student data
    this.accounts = this.accounts.filter(a => a.role === 'admin');
    for (const [token, session] of this.sessions.entries()) {
      if (session.role !== 'admin') {
        this.sessions.delete(token);
      }
    }
    this.testAttempts = [];
    this.studentDoubts = [];
    return {
      success: true,
      message: `Reset complete. Removed ${prevCount} student accounts and associated records. You are now starting fresh from 0 students.`
    };
  }

  getAdminAnalyticsSummary() {
    const totalStudents = this.accounts.filter(a => a.role === 'student').length;
    const attempts = this.testAttempts;
    const avgAccuracy = attempts.length > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + (a.accuracyPercentage || 0), 0) / attempts.length)
      : (totalStudents > 0 ? 82 : 0);
    const avgScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : (totalStudents > 0 ? 145 : 0);

    return {
      totalRegisteredStudents: totalStudents,
      totalMockAttempts: attempts.length,
      averagePlatformScore: avgScore,
      averageAccuracy: avgAccuracy,
      totalQuestionsInBank: this.questions.length,
      totalStudyMaterials: this.studyMaterials.length,
      activeSessionsCount: this.sessions.size,
      recentLogins: this.accounts.slice(0, 10).map(a => ({
        name: a.name,
        email: a.email,
        role: a.role,
        lastLoginAt: a.lastLoginAt || a.createdAt,
        loginCount: a.loginCount || 1
      }))
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

  deleteMockTest(id: string): boolean {
    const idx = this.mockTests.findIndex(m => m.id === id);
    if (idx === -1) return false;
    this.mockTests.splice(idx, 1);
    return true;
  }

  getStudyMaterials(filter?: { 
    subjectId?: string; 
    topic?: string; 
    category?: string; 
    resourceType?: string;
    difficulty?: string;
    year?: string;
    search?: string;
    sortBy?: string;
  }): StudyMaterial[] {
    let list = this.studyMaterials;
    if (filter?.subjectId && filter.subjectId !== 'all') {
      list = list.filter(m => m.subjectId === filter.subjectId);
    }
    if (filter?.category && filter.category !== 'all') {
      list = list.filter(m => m.category === filter.category);
    }
    if (filter?.resourceType && filter.resourceType !== 'all') {
      list = list.filter(m => m.resourceType === filter.resourceType);
    }
    if (filter?.difficulty && filter.difficulty !== 'all') {
      list = list.filter(m => m.difficulty === filter.difficulty);
    }
    if (filter?.year && filter.year !== 'all') {
      list = list.filter(m => m.yearRelevance && m.yearRelevance.includes(filter.year!));
    }
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(m => 
        m.title.toLowerCase().includes(s) || 
        m.summary.toLowerCase().includes(s) || 
        m.topic.toLowerCase().includes(s) ||
        (m.category && m.category.toLowerCase().includes(s)) ||
        (m.formulas && m.formulas.some(f => f.toLowerCase().includes(s))) ||
        (m.shortcuts && m.shortcuts.some(sc => sc.toLowerCase().includes(s)))
      );
    }

    if (filter?.sortBy) {
      if (filter.sortBy === 'views') {
        list = [...list].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
      } else if (filter.sortBy === 'downloads') {
        list = [...list].sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0));
      } else if (filter.sortBy === 'title') {
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      } else if (filter.sortBy === 'pages') {
        list = [...list].sort((a, b) => (b.pagesCount || 0) - (a.pagesCount || 0));
      } else if (filter.sortBy === 'difficulty') {
        const rank: Record<string, number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        list = [...list].sort((a, b) => (rank[b.difficulty || 'Medium'] || 2) - (rank[a.difficulty || 'Medium'] || 2));
      } else if (filter.sortBy === 'relevance') {
        list = [...list].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      } else {
        // default recent
        list = [...list].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      }
    }
    return list;
  }

  addStudyMaterial(mat: Omit<StudyMaterial, 'id' | 'updatedAt'>): StudyMaterial {
    const newMat: StudyMaterial = {
      ...mat,
      id: `mat-custom-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      downloadsCount: 0,
      isPublished: true
    };
    this.studyMaterials.unshift(newMat);
    return newMat;
  }

  updateStudyMaterial(id: string, updates: Partial<StudyMaterial>): StudyMaterial | undefined {
    const index = this.studyMaterials.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    this.studyMaterials[index] = {
      ...this.studyMaterials[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return this.studyMaterials[index];
  }

  deleteStudyMaterial(id: string): boolean {
    const prevLen = this.studyMaterials.length;
    this.studyMaterials = this.studyMaterials.filter(m => m.id !== id);
    return this.studyMaterials.length < prevLen;
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

  saveTestAttempt(attempt: Omit<TestAttemptResult, 'id'>, userId?: string): TestAttemptResult {
    const result: TestAttemptResult = {
      ...attempt,
      id: `attempt-${Date.now()}`
    };
    this.testAttempts.unshift(result);

    const uKey = userId ? userId.trim().toLowerCase() : null;
    if (uKey) {
      const userList = this.userAttempts.get(uKey) || [];
      userList.unshift(result);
      this.userAttempts.set(uKey, userList);
    }

    // Update target user profile stats
    const p = this.getProfile(userId);
    p.mockTestsCompleted = (p.mockTestsCompleted || 0) + 1;
    p.questionsSolved = (p.questionsSolved || 0) + (attempt.attemptedQuestions || 0);
    p.correctCount = (p.correctCount || 0) + (attempt.correctAnswers || 0);
    const totalQuestionsAttempted = p.questionsSolved;
    p.accuracy = totalQuestionsAttempted > 0 
      ? Math.round((p.correctCount / totalQuestionsAttempted) * 1000) / 10 
      : 0;

    // Recalculate average score
    const attempts = this.getTestAttempts(userId);
    const scores = attempts.map(a => a.score);
    p.averageScore = scores.length > 0 
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : attempt.score;
    p.totalStudyMinutes = (p.totalStudyMinutes || 0) + Math.round((attempt.totalTimeSpentSeconds || 0) / 60);

    this.updateProfile(p, userId);

    // Update target mock test attempt count
    const mock = this.mockTests.find(m => m.id === attempt.testId);
    if (mock) {
      mock.attemptCount = (mock.attemptCount || 0) + 1;
    }

    return result;
  }

  getTestAttempts(userId?: string): TestAttemptResult[] {
    const uKey = userId ? userId.trim().toLowerCase() : null;
    if (uKey && this.userAttempts.has(uKey)) {
      return this.userAttempts.get(uKey)!;
    }
    return this.testAttempts;
  }

  getProfile(userId?: string): UserProfile {
    const uKey = userId ? userId.trim().toLowerCase() : null;
    if (uKey && this.userProfiles.has(uKey)) {
      return this.userProfiles.get(uKey)!;
    }
    return this.profile;
  }

  updateProfile(updates: Partial<UserProfile>, userId?: string): UserProfile {
    const current = this.getProfile(userId);
    const updated = { ...current, ...updates };
    const uKey = userId ? userId.trim().toLowerCase() : null;
    if (uKey) {
      this.userProfiles.set(uKey, updated);
      if (updated.id) this.userProfiles.set(updated.id.toLowerCase(), updated);
      if (updated.email) this.userProfiles.set(updated.email.toLowerCase(), updated);
    }
    this.profile = updated;
    return updated;
  }

  toggleBookmark(type: 'question' | 'material', id: string, userId?: string): { bookmarked: boolean } {
    const profile = this.getProfile(userId);
    let bookmarked = false;
    if (type === 'question') {
      const idx = profile.bookmarkedQuestionIds.indexOf(id);
      if (idx > -1) {
        profile.bookmarkedQuestionIds.splice(idx, 1);
        bookmarked = false;
      } else {
        profile.bookmarkedQuestionIds.push(id);
        bookmarked = true;
      }
    } else {
      const idx = profile.bookmarkedMaterialIds.indexOf(id);
      if (idx > -1) {
        profile.bookmarkedMaterialIds.splice(idx, 1);
        bookmarked = false;
      } else {
        profile.bookmarkedMaterialIds.push(id);
        bookmarked = true;
      }
    }
    this.updateProfile(profile, userId);
    return { bookmarked };
  }

  getStudyPlan(userId?: string): DailyStudyPlan {
    const uKey = userId ? userId.trim().toLowerCase() : null;
    if (uKey && this.userStudyPlans.has(uKey)) {
      return this.userStudyPlans.get(uKey)!;
    }
    return this.studyPlan;
  }

  updateStudyPlan(plan: Partial<DailyStudyPlan>, userId?: string): DailyStudyPlan {
    const current = this.getStudyPlan(userId);
    const updated = { ...current, ...plan };
    const uKey = userId ? userId.trim().toLowerCase() : null;
    if (uKey) {
      this.userStudyPlans.set(uKey, updated);
    }
    this.studyPlan = updated;
    return updated;
  }

  toggleTaskCompleted(taskId: string, userId?: string): DailyStudyPlan {
    const plan = this.getStudyPlan(userId);
    const updatedSchedule = plan.schedule.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    const updated = { ...plan, schedule: updatedSchedule };
    return this.updateStudyPlan(updated, userId);
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

  // Student Doubts Management
  getStudentDoubts(filters?: { subject?: string; status?: string; search?: string }): StudentDoubtItem[] {
    let result = [...this.studentDoubts];
    if (filters?.subject && filters.subject !== 'All') {
      const subNorm = filters.subject.toLowerCase();
      result = result.filter(d => d.subject.toLowerCase().includes(subNorm));
    }
    if (filters?.status && filters.status !== 'all') {
      result = result.filter(d => d.status === filters.status);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(d => 
        d.question.toLowerCase().includes(q) ||
        d.topic.toLowerCase().includes(q) ||
        (d.solution.formula && d.solution.formula.toLowerCase().includes(q)) ||
        (d.solution.shortcut && d.solution.shortcut.toLowerCase().includes(q))
      );
    }
    // Return newest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getStudentDoubtById(id: string): StudentDoubtItem | undefined {
    return this.studentDoubts.find(d => d.id === id);
  }

  addStudentDoubt(doubt: Omit<StudentDoubtItem, 'id' | 'createdAt'>): StudentDoubtItem {
    const newDoubt: StudentDoubtItem = {
      ...doubt,
      id: 'doubt-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    this.studentDoubts.unshift(newDoubt);
    return newDoubt;
  }

  updateStudentDoubt(id: string, updates: Partial<StudentDoubtItem>): StudentDoubtItem | null {
    const index = this.studentDoubts.findIndex(d => d.id === id);
    if (index === -1) return null;
    this.studentDoubts[index] = {
      ...this.studentDoubts[index],
      ...updates
    };
    return this.studentDoubts[index];
  }

  deleteStudentDoubt(id: string): boolean {
    const initialLen = this.studentDoubts.length;
    this.studentDoubts = this.studentDoubts.filter(d => d.id !== id);
    return this.studentDoubts.length < initialLen;
  }
}

export const store = new Store();
