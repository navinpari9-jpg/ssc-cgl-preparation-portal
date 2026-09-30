import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, NotificationItem } from '../types';
import { api } from '../services/api';
import { currentUser, APP_LANGUAGE } from '../data/currentUser';
import { AuthProvider, useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

export const pageToPath = (page: string): string => {
  switch (page) {
    case 'landing': return '/';
    case 'login': return '/login';
    case 'register': return '/register';
    case 'forgot-password': return '/forgot-password';
    case 'dashboard': return '/dashboard';
    case 'subjects': return '/syllabus';
    case 'practice': return '/practice';
    case 'mock-tests': return '/mock-tests';
    case 'analytics': return '/performance';
    case 'ai-tutor': return '/ai-tutor';
    case 'ai-generator': return '/ai-question-generator';
    case 'daily-planner': return '/study-planner';
    case 'study-materials': return '/study-materials';
    case 'current-affairs': return '/current-affairs';
    case 'pyq': return '/pyq';
    case 'leaderboard': return '/leaderboard';
    case 'profile': return '/profile';
    case 'admin': return '/admin';
    default: return '/dashboard';
  }
};

export const pathToPage = (pathname: string): string => {
  const clean = pathname.replace(/\/$/, '') || '/';
  switch (clean) {
    case '/': return 'landing';
    case '/login': return 'login';
    case '/register': return 'register';
    case '/forgot-password': return 'forgot-password';
    case '/dashboard': return 'dashboard';
    case '/syllabus':
    case '/subjects': return 'subjects';
    case '/practice': return 'practice';
    case '/mock-tests': return 'mock-tests';
    case '/performance':
    case '/analytics': return 'analytics';
    case '/ai-tutor': return 'ai-tutor';
    case '/ai-question-generator':
    case '/ai-generator': return 'ai-generator';
    case '/study-planner':
    case '/daily-planner': return 'daily-planner';
    case '/study-materials': return 'study-materials';
    case '/current-affairs': return 'current-affairs';
    case '/pyq': return 'pyq';
    case '/leaderboard': return 'leaderboard';
    case '/profile': return 'profile';
    case '/admin': return 'admin';
    default: return 'dashboard';
  }
};

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  language: string;
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  refreshUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markNotifAsRead: (id: string) => Promise<void>;
  toggleBookmark: (type: 'question' | 'material', id: string) => Promise<boolean>;
  activePage: string;
  setActivePage: (page: string) => void;
  activeSubjectFilter?: string;
  setActiveSubjectFilter: (subId?: string) => void;
  activeTopicFilter?: string;
  setActiveTopicFilter: (topic?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser: authUser, isAuthenticated, logout: authLogout } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(authUser || {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    role: 'student',
    targetExamYear: currentUser.targetExamYear,
    targetTier: currentUser.targetTier,
    streak: currentUser.streak,
    lastStreakDate: new Date().toISOString().split('T')[0],
    totalStudyMinutes: currentUser.totalStudyMinutes,
    questionsSolved: currentUser.questionsSolved,
    correctCount: currentUser.correctCount,
    mockTestsCompleted: currentUser.mockTestsCompleted,
    averageScore: currentUser.averageScore,
    accuracy: currentUser.accuracy,
    bookmarkedQuestionIds: ['q-quant-03', 'q-reas-02'],
    bookmarkedMaterialIds: ['mat-quant-formulas'],
    hideFromLeaderboard: false,
    achievements: []
  });

  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('ssc_theme') as 'light' | 'dark') || 'light';
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  // Initialize activePage based on browser URL
  const [activePage, setActivePageState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const initialPath = window.location.pathname;
      return pathToPage(initialPath);
    }
    return 'dashboard';
  });

  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string | undefined>(undefined);
  const [activeTopicFilter, setActiveTopicFilter] = useState<string | undefined>(undefined);

  // Sync user with AuthContext
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  // Handle URL synchronization
  const setActivePage = (page: string) => {
    setActivePageState(page);
    if (typeof window !== 'undefined') {
      const targetPath = pageToPath(page);
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  // Browser back/forward navigation sync
  useEffect(() => {
    const handlePopState = () => {
      const newPage = pathToPage(window.location.pathname);
      setActivePageState(newPage);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Theme synchronization
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ssc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshUser = async () => {
    try {
      const u = await api.getUserProfile();
      setUser(u);
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  };

  const logoutUser = async () => {
    await authLogout();
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Logged out successfully.'
    });
    setActivePage('login');
  };

  const loadNotifications = async () => {
    try {
      const list = await api.getNotifications();
      setNotifications(list);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([refreshUser(), loadNotifications()]);
      setLoading(false);
    };
    init();
  }, []);

  const markNotifAsRead = async (id: string) => {
    try {
      const updated = await api.markNotificationRead(id);
      setNotifications(updated);
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const toggleBookmark = async (type: 'question' | 'material', id: string): Promise<boolean> => {
    try {
      const res = await api.toggleBookmark(type, id);
      await refreshUser();
      showToast({
        type: 'info',
        title: res.bookmarked ? 'Bookmark Saved' : 'Bookmark Removed',
        message: res.bookmarked ? 'Item added to your saved collection.' : 'Item removed from saved collection.'
      });
      return res.bookmarked;
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to update bookmark' });
      return false;
    }
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user: authUser || user,
        isAuthenticated,
        language: APP_LANGUAGE,
        loading,
        theme,
        toggleTheme,
        toasts,
        showToast,
        removeToast,
        refreshUser,
        logoutUser,
        notifications,
        unreadNotifCount,
        markNotifAsRead,
        toggleBookmark,
        activePage,
        setActivePage,
        activeSubjectFilter,
        setActiveSubjectFilter,
        activeTopicFilter,
        setActiveTopicFilter
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AppContextProviderInner>
        {children}
      </AppContextProviderInner>
    </AuthProvider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
