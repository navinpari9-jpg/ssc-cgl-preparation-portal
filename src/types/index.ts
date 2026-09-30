// SSC CGL Preparation Portal - Comprehensive Data Models

export type SubjectId = 'quantitative-aptitude' | 'reasoning' | 'english' | 'general-awareness';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  subjectId: SubjectId;
  topic: string;
  subtopic?: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, 3
  explanation: string;
  shortcutTrick?: string;
  formulaUsed?: string;
  difficulty: DifficultyLevel;
  pyqYear?: number;
  pyqTier?: 'Tier-1' | 'Tier-2';
  pyqExam?: string;
  tags?: string[];
  createdAt?: string;
}

export type QuestionPaletteStatus = 
  | 'not-visited'
  | 'not-answered'
  | 'answered'
  | 'marked-review'
  | 'answered-marked-review';

export interface MockTest {
  id: string;
  title: string;
  description: string;
  type: 'full-tier1' | 'full-tier2' | 'subject' | 'pyq';
  subjectId?: SubjectId;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  positiveMarksPerQuestion: number;
  negativeMarksPerQuestion: number;
  sections?: {
    subjectId: SubjectId;
    title: string;
    questionCount: number;
    marks: number;
  }[];
  questionIds: string[];
  pyqYear?: number;
  difficulty: DifficultyLevel;
  attemptCount: number;
  averageScore?: number;
  createdAt?: string;
}

export interface TestAnswerRecord {
  questionId: string;
  selectedOption: number | null; // 0-3 or null
  isCorrect: boolean;
  timeSpentSeconds: number;
  status: QuestionPaletteStatus;
}

export interface TestAttemptResult {
  id: string;
  testId: string;
  testTitle: string;
  testType: string;
  userId: string;
  userName: string;
  startedAt: string;
  completedAt: string;
  totalTimeSpentSeconds: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattemptedQuestions: number;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  sectionBreakdown: {
    subjectId: SubjectId;
    subjectName: string;
    score: number;
    maxScore: number;
    attempted: number;
    correct: number;
    wrong: number;
    accuracy: number;
  }[];
  topicBreakdown: {
    topic: string;
    subjectId: SubjectId;
    total: number;
    correct: number;
    wrong: number;
  }[];
  answers: TestAnswerRecord[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  subjectId: SubjectId;
  topic: string;
  category: 'Notes' | 'Formulas' | 'Short Tricks' | 'Vocabulary' | 'PYQ Analysis' | 'Static GK';
  readTimeMinutes: number;
  summary: string;
  content: string;
  keyPoints?: string[];
  downloadablePdf?: string;
  bookmarked?: boolean;
  completed?: boolean;
  updatedAt: string;
}

export interface CurrentAffairItem {
  id: string;
  title: string;
  date: string;
  category: 'National' | 'International' | 'Economy' | 'Science & Tech' | 'Sports' | 'Awards' | 'Appointments' | 'Govt Schemes' | 'Important Days';
  summary: string;
  detailedText: string;
  tags: string[];
  sampleQuestions?: {
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface StudyTask {
  id: string;
  timeSlot: string;
  subjectId: SubjectId;
  subjectName: string;
  topic: string;
  taskType: 'Theory / Notes' | 'Practice Drill' | 'Mock Test' | 'Revision' | 'Vocab / GK';
  durationMinutes: number;
  completed: boolean;
}

export interface DailyStudyPlan {
  id: string;
  examTargetDate: string;
  dailyHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  strongSubjects: SubjectId[];
  weakSubjects: SubjectId[];
  weeklyTargetMockTests: number;
  weeklyTargetQuestions: number;
  schedule: StudyTask[];
  streakDays: number;
  lastActiveDate: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  targetExamYear: string;
  targetTier: 'Tier-1' | 'Tier-2';
  streak: number;
  lastStreakDate: string;
  totalStudyMinutes: number;
  questionsSolved: number;
  correctCount: number;
  mockTestsCompleted: number;
  averageScore: number;
  accuracy: number;
  bookmarkedQuestionIds: string[];
  bookmarkedMaterialIds: string[];
  hideFromLeaderboard: boolean;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: string | null;
  progress: number;
  maxProgress: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarSeed: string;
  score: number;
  accuracy: number;
  testsCompleted: number;
  streak: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'test' | 'achievement' | 'alert';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface SubjectMetadata {
  id: SubjectId;
  name: string;
  subtitle?: string;
  icon: string;
  color: string;
  totalTopics: number;
  weightageTier1: string; // e.g. "25 Qs / 50 Marks"
  description: string;
  topics: {
    name: string;
    questionCount: number;
    difficulty: DifficultyLevel;
    completed?: boolean;
    importance: 'High' | 'Medium' | 'Low';
  }[];
}
