import { UserProfile, DailyStudyPlan, StudentDoubtItem } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../../server/data';

export {
  SUBJECTS_CATALOG,
  INITIAL_QUESTIONS,
  INITIAL_MOCK_TESTS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_CURRENT_AFFAIRS,
  INITIAL_LEADERBOARD,
  INITIAL_ACHIEVEMENTS,
  INITIAL_NOTIFICATIONS
} from '../../server/data';

export const fallbackProfile: UserProfile = {
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
  accuracy: 82,
  bookmarkedQuestionIds: ['q-quant-03', 'q-reas-02'],
  bookmarkedMaterialIds: ['mat-quant-formulas'],
  hideFromLeaderboard: false,
  achievements: INITIAL_ACHIEVEMENTS
};

export const fallbackStudyPlan: DailyStudyPlan = {
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

export const fallbackStudentDoubts: StudentDoubtItem[] = [
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
      shortcut: 'Direct Formula: MP / CP = (100 + Profit%) / (100 - Discount%) = 125 / 80 = 25 / 16. Since CP (16 units) = ₹640, 1 unit = 40. Therefore MP (25 units) = 25 × 40 = ₹1,000.',
      examTip: 'Whenever both discount% and profit% are given, immediately write MP/CP = (100 + P)/(100 - D).',
      relatedTopics: ['Profit and Loss', 'Percentage', 'Ratio and Proportion']
    }
  }
];
