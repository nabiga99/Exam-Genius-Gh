import React, { useState, useEffect } from 'react';
import Landing from '@/components/Landing';
import AuthModal from '@/components/AuthModal';
import Dashboard from '@/components/Dashboard';
import GenerateWizard from '@/components/GenerateWizard';
import DocumentManagement from '@/components/DocumentManagement';
import MyQuestionSets from '@/components/MyQuestionSets';
import BillingSubscription from '@/components/BillingSubscription';
import ProfileSettings from '@/components/ProfileSettings';
import HelpSupport from '@/components/HelpSupport';
import { auth } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

type CurrentView = 'landing' | 'dashboard' | 'generate' | 'documents' | 'sets' | 'billing' | 'settings' | 'support';
type AuthModalMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

const Index = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = auth.isAuthenticated();
      setIsAuthenticated(isLoggedIn);
      if (isLoggedIn && currentView === 'landing') {
        setCurrentView('dashboard');
      }
    };
    
    checkAuth();
    
    // Listen for storage events (for when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [currentView]);

  const handleGetStarted = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    setAuthModalMode('register');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setShowAuthModal(false);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    toast({
      title: "Welcome back!",
      description: "You've successfully logged in.",
    });
  };

  const handleLogout = () => {
    auth.logout();
    setIsAuthenticated(false);
    setCurrentView('landing');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const handleCreateNew = () => {
    setCurrentView('generate');
  };

  const handleNavigation = (view: CurrentView) => {
    // Only allow navigation to protected pages if authenticated
    if (!isAuthenticated && view !== 'landing') {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    
    setCurrentView(view);
  };

  // Render the appropriate view
  const renderView = () => {
    // If not authenticated and trying to access protected pages, show landing
    if (!isAuthenticated && currentView !== 'landing') {
      return (
        <>
          <Landing onGetStarted={handleGetStarted} onSignUp={handleSignUp} />
          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            initialMode={authModalMode}
          />
        </>
      );
    }

    switch (currentView) {
      case 'generate':
        return (
          <GenerateWizard 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            onCreateNew={handleCreateNew}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'documents':
        return (
          <DocumentManagement 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'sets':
        return (
          <MyQuestionSets 
            onLogout={handleLogout}
            onCreateNew={handleCreateNew}
            onNavigate={handleNavigation}
          />
        );
      case 'billing':
        return (
          <BillingSubscription 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'settings':
        return (
          <ProfileSettings 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      case 'support':
        return (
          <HelpSupport 
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      default:
        return (
          <>
            <Landing onGetStarted={handleGetStarted} onSignUp={handleSignUp} />
            <AuthModal 
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onLogin={handleLogin}
              initialMode={authModalMode}
            />
          </>
        );
    }
  };

  return renderView();
};

export default Index;
