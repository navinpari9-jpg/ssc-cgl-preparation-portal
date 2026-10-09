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
import { SettingsPage } from './pages/SettingsPage';
import { QuizQuestionPage } from './pages/QuizQuestionPage';
import { QuizResultPage } from './pages/QuizResultPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const { activePage, setActivePage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = ['login', 'register', 'forgot-password'].includes(activePage);
  const isLandingPage = activePage === 'landing';
  const isNotFoundPage = activePage === 'not-found';
  const showSidebar = !isAuthPage && !isLandingPage && !isNotFoundPage;

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
      case 'settings':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/settings">
            <SettingsPage />
          </ProtectedRoute>
        );
      case 'quiz':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/quiz">
            <QuizQuestionPage />
          </ProtectedRoute>
        );
      case 'quiz-result':
        return (
          <ProtectedRoute requiredRole="student" pagePath="/quiz-result">
            <QuizResultPage />
          </ProtectedRoute>
        );

      // Protected Admin Route with Secret Token Gate
      case 'admin':
        return <AdminPage />;

      // 404 Not Found Route
      case 'not-found':
        return <NotFoundPage />;

      default:
        return (
          <ProtectedRoute requiredRole="student" pagePath="/dashboard">
            <DashboardPage />
          </ProtectedRoute>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex font-sans antialiased">
      {/* Docked Premium Left Sidebar */}
      {showSidebar && (
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Workspace Body with Header and Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAuthModal={() => setActivePage('login')}
        />

        {/* Scrollable Page Content Area */}
        <main className={`flex-1 min-w-0 ${
          isLandingPage 
            ? 'w-full' 
            : isAuthPage 
            ? 'px-4 py-8 max-w-4xl mx-auto w-full' 
            : 'px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full'
        }`}>
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
