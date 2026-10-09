import { UserProfile, TestAttemptResult, DailyStudyPlan } from '../types';
import { fallbackProfile, fallbackStudyPlan } from '../data/fallbackData';

const USER_DATA_PREFIX = 'ssc_user_data_';
const USER_ATTEMPTS_PREFIX = 'ssc_user_attempts_';
const USER_PLAN_PREFIX = 'ssc_user_plan_';

export const userSyncManager = {
  getStorageKey(emailOrId?: string): string {
    if (!emailOrId) return 'default';
    return emailOrId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  },

  getCurrentUserFromStorage(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('ssc_current_user');
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore parse errors
    }
    return null;
  },

  setCurrentUserInStorage(user: UserProfile | null): void {
    if (typeof window === 'undefined') return;
    try {
      if (user) {
        localStorage.setItem('ssc_current_user', JSON.stringify(user));
        this.saveUserProfile(user);
      } else {
        localStorage.removeItem('ssc_current_user');
      }
    } catch {
      // Ignore storage errors
    }
  },

  getUserProfile(emailOrId?: string): UserProfile {
    if (typeof window === 'undefined') return fallbackProfile;
    const currentUser = this.getCurrentUserFromStorage();
    const targetKey = this.getStorageKey(emailOrId || currentUser?.email || currentUser?.id);

    try {
      const raw = localStorage.getItem(`${USER_DATA_PREFIX}${targetKey}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...fallbackProfile,
          ...parsed,
          bookmarkedQuestionIds: Array.isArray(parsed.bookmarkedQuestionIds) ? parsed.bookmarkedQuestionIds : [],
          bookmarkedMaterialIds: Array.isArray(parsed.bookmarkedMaterialIds) ? parsed.bookmarkedMaterialIds : []
        };
      }
    } catch {
      // Fallback below
    }

    if (currentUser) {
      return {
        ...fallbackProfile,
        ...currentUser,
        bookmarkedQuestionIds: Array.isArray(currentUser.bookmarkedQuestionIds) ? currentUser.bookmarkedQuestionIds : [],
        bookmarkedMaterialIds: Array.isArray(currentUser.bookmarkedMaterialIds) ? currentUser.bookmarkedMaterialIds : []
      };
    }

    return fallbackProfile;
  },

  saveUserProfile(profile: UserProfile): UserProfile {
    if (typeof window === 'undefined') return profile;
    const targetKey = this.getStorageKey(profile.email || profile.id);
    try {
      localStorage.setItem(`${USER_DATA_PREFIX}${targetKey}`, JSON.stringify(profile));
      const current = this.getCurrentUserFromStorage();
      if (current && (current.email === profile.email || current.id === profile.id)) {
        localStorage.setItem('ssc_current_user', JSON.stringify(profile));
      }
    } catch {
      // Ignore quota/storage errors
    }
    return profile;
  },

  toggleBookmark(type: 'question' | 'material', id: string, emailOrId?: string): { bookmarked: boolean; profile: UserProfile } {
    const current = this.getUserProfile(emailOrId);
    let bookmarked = false;

    if (type === 'question') {
      const list = [...(current.bookmarkedQuestionIds || [])];
      const idx = list.indexOf(id);
      if (idx > -1) {
        list.splice(idx, 1);
        bookmarked = false;
      } else {
        list.push(id);
        bookmarked = true;
      }
      current.bookmarkedQuestionIds = list;
    } else {
      const list = [...(current.bookmarkedMaterialIds || [])];
      const idx = list.indexOf(id);
      if (idx > -1) {
        list.splice(idx, 1);
        bookmarked = false;
      } else {
        list.push(id);
        bookmarked = true;
      }
      current.bookmarkedMaterialIds = list;
    }

    this.saveUserProfile(current);
    return { bookmarked, profile: current };
  },

  recordTestAttempt(attempt: Omit<TestAttemptResult, 'id'>, emailOrId?: string): { attempt: TestAttemptResult; profile: UserProfile } {
    const newAttempt: TestAttemptResult = {
      ...attempt,
      id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };

    if (typeof window !== 'undefined') {
      const targetKey = this.getStorageKey(emailOrId);
      try {
        const raw = localStorage.getItem(`${USER_ATTEMPTS_PREFIX}${targetKey}`);
        const existing: TestAttemptResult[] = raw ? JSON.parse(raw) : [];
        existing.unshift(newAttempt);
        localStorage.setItem(`${USER_ATTEMPTS_PREFIX}${targetKey}`, JSON.stringify(existing));
      } catch {
        // Ignore
      }
    }

    // Update profile stats with this attempt
    const profile = this.getUserProfile(emailOrId);
    profile.mockTestsCompleted = (profile.mockTestsCompleted || 0) + 1;
    profile.questionsSolved = (profile.questionsSolved || 0) + (attempt.attemptedQuestions || 0);
    profile.correctCount = (profile.correctCount || 0) + (attempt.correctAnswers || 0);
    profile.totalStudyMinutes = (profile.totalStudyMinutes || 0) + Math.round((attempt.totalTimeSpentSeconds || 0) / 60);

    if (profile.questionsSolved > 0) {
      profile.accuracy = Math.round((profile.correctCount / profile.questionsSolved) * 1000) / 10;
    }

    // Recalculate average score
    const attempts = this.getTestAttempts(emailOrId);
    if (attempts.length > 0) {
      const totalScore = attempts.reduce((acc, a) => acc + (a.score || 0), 0);
      profile.averageScore = Math.round((totalScore / attempts.length) * 10) / 10;
    } else {
      profile.averageScore = attempt.score;
    }

    this.saveUserProfile(profile);
    return { attempt: newAttempt, profile };
  },

  getTestAttempts(emailOrId?: string): TestAttemptResult[] {
    if (typeof window === 'undefined') return [];
    const targetKey = this.getStorageKey(emailOrId);
    try {
      const raw = localStorage.getItem(`${USER_ATTEMPTS_PREFIX}${targetKey}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return [];
  },

  getStudyPlan(emailOrId?: string): DailyStudyPlan {
    if (typeof window === 'undefined') return fallbackStudyPlan;
    const targetKey = this.getStorageKey(emailOrId);
    try {
      const raw = localStorage.getItem(`${USER_PLAN_PREFIX}${targetKey}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return fallbackStudyPlan;
  },

  saveStudyPlan(plan: DailyStudyPlan, emailOrId?: string): DailyStudyPlan {
    if (typeof window === 'undefined') return plan;
    const targetKey = this.getStorageKey(emailOrId);
    try {
      localStorage.setItem(`${USER_PLAN_PREFIX}${targetKey}`, JSON.stringify(plan));
    } catch {
      // Ignore
    }
    return plan;
  },

  toggleStudyPlanTask(taskId: string, emailOrId?: string): DailyStudyPlan {
    const plan = this.getStudyPlan(emailOrId);
    const updatedSchedule = plan.schedule.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updatedPlan: DailyStudyPlan = { ...plan, schedule: updatedSchedule };
    return this.saveStudyPlan(updatedPlan, emailOrId);
  }
};
