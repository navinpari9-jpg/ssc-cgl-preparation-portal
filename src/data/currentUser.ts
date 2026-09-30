// Centralized Current User and Application Language Configuration
export const APP_LANGUAGE = 'en';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  targetExam: string;
  targetExamYear: string;
  targetTier: 'Tier-1' | 'Tier-2';
  streak: number;
  questionsSolved: number;
  correctCount: number;
  accuracy: number;
  mockTestsCompleted: number;
  averageScore: number;
  studyHours: number;
  totalStudyMinutes: number;
  todayGoalHours: number;
}

export const currentUser: CurrentUser = {
  id: 'user-demo',
  name: 'Navin Kumar',
  email: 'navin.kumar@example.com',
  role: 'SSC CGL Aspirant',
  targetExam: 'SSC CGL',
  targetExamYear: '2026-2027',
  targetTier: 'Tier-1',
  streak: 12,
  questionsSolved: 1245,
  correctCount: 1021,
  accuracy: 82,
  mockTestsCompleted: 18,
  averageScore: 148.5,
  studyHours: 64.5,
  totalStudyMinutes: 3870,
  todayGoalHours: 3
};

export const getDisplayName = (user?: { name?: string } | null): string => {
  return user?.name?.trim() ? user.name : currentUser.name;
};
