import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { PracticePage } from './pages/PracticePage';
import { MockTestsPage } from './pages/MockTestsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AITutorPage } from './pages/AITutorPage';
import { AIQuestionGeneratorPage } from './pages/AIQuestionGeneratorPage';
import { StudyMaterialsPage } from './pages/StudyMaterialsPage';
import { DailyStudyPlanPage } from './pages/DailyStudyPlanPage';
import { CurrentAffairsPage } from './pages/CurrentAffairsPage';
import { PYQPage } from './pages/PYQPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { activePage, setActivePage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = ['login', 'register', 'forgot-password'].includes(activePage);
  const isLandingPage = activePage === 'landing';
  const showSidebar = !isAuthPage && !isLandingPage;

  const renderActivePage = () => {
    switch (activePage) {
      // Public Routes
      case 'landing':
        return (
          <LandingPage
            onStartPreparation={() => setActivePage('dashboard')}
            onTakeMockTest={() => setActivePage('mock-tests')}
          />
        );
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;

      // Protected Student Routes
      case 'dashboard':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/dashboard">
            <DashboardPage />
          </ProtectedRoute>
        );
      case 'subjects':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/syllabus">
            <SubjectsPage />
          </ProtectedRoute>
        );
      case 'practice':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/practice">
            <PracticePage />
          </ProtectedRoute>
        );
      case 'mock-tests':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/mock-tests">
            <MockTestsPage />
          </ProtectedRoute>
        );
      case 'analytics':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/performance">
            <AnalyticsPage />
          </ProtectedRoute>
        );
      case 'ai-tutor':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/ai-tutor">
            <AITutorPage />
          </ProtectedRoute>
        );
      case 'ai-generator':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/ai-question-generator">
            <AIQuestionGeneratorPage />
          </ProtectedRoute>
        );
      case 'study-materials':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/study-materials">
            <StudyMaterialsPage />
          </ProtectedRoute>
        );
      case 'daily-planner':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/study-planner">
            <DailyStudyPlanPage />
          </ProtectedRoute>
        );
      case 'current-affairs':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/current-affairs">
            <CurrentAffairsPage />
          </ProtectedRoute>
        );
      case 'pyq':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/pyq">
            <PYQPage />
          </ProtectedRoute>
        );
      case 'leaderboard':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/leaderboard">
            <LeaderboardPage />
          </ProtectedRoute>
        );
      case 'profile':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/profile">
            <ProfilePage />
          </ProtectedRoute>
        );

      // Protected Admin Route
      case 'admin':
        return (
          <ProtectedRoute requiredRole="admin" pagePath="/admin">
            <AdminPage />
          </ProtectedRoute>
        );

      default:
        return (
          <ProtectedRoute requiredRole="student" pagePath="/dashboard">
            <DashboardPage />
          </ProtectedRoute>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Fixed Navbar */}
      <Navbar
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenAuthModal={() => setActivePage('login')}
      />

      {/* Main Workspace Body with Optional Sidebar */}
      <div className={`flex-1 flex w-full mx-auto ${isLandingPage ? 'max-w-7xl' : isAuthPage ? 'max-w-6xl' : 'max-w-7xl'}`}>
        {showSidebar && (
          <Sidebar
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Scrollable Page Content Area */}
        <main className={`flex-1 min-w-0 ${isAuthPage ? 'px-2 sm:px-4 py-4' : 'px-4 sm:px-6 lg:px-8 pb-20 md:pb-12 pt-4'} overflow-y-auto`}>
          {renderActivePage()}
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
