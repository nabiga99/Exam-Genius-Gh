import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import Landing from '@/components/Landing';
import Dashboard from '@/components/Dashboard';
import GenerateWizard from '@/components/GenerateWizard';
import DocumentManagement from '@/components/DocumentManagement';
import MyQuestionSets from '@/components/MyQuestionSets';
import BillingSubscription from '@/components/BillingSubscription';
import ProfileSettings from '@/components/ProfileSettings';
import HelpSupport from '@/components/HelpSupport';
import { toast } from '@/components/ui/use-toast';
import { isClerkAvailable } from '@/lib/clerk-utils';

type CurrentView = 'landing' | 'dashboard' | 'generate' | 'documents' | 'sets' | 'billing' | 'settings' | 'support';
type AuthModalMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

const Index = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasClerk = isClerkAvailable();
  
  // Only use Clerk hooks if available
  const userHook = hasClerk ? useUser() : { isLoaded: true, isSignedIn: false, user: null };
  const clerkHook = hasClerk ? useClerk() : null;
  
  // Create a dummy user for development mode
  const devUser = {
    id: 'dev-user-1',
    fullName: 'Development User',
    email: 'dev@example.com',
  };
  
  const { isLoaded, isSignedIn } = userHook;

  // Check dev mode authentication
  useEffect(() => {
    if (!hasClerk) {
      const devUserExists = localStorage.getItem('dev-user') !== null;
      setIsAuthenticated(devUserExists);
      if (devUserExists && currentView === 'landing') {
        setCurrentView('dashboard');
      }
    }
  }, [hasClerk, currentView]);

  // For Clerk mode, update based on sign-in state
  useEffect(() => {
    if (hasClerk && isLoaded) {
      if (isSignedIn && currentView === 'landing') {
        setCurrentView('dashboard');
      }
    }
  }, [hasClerk, isLoaded, isSignedIn, currentView]);

  const handleGetStarted = () => {
    // In dev mode, simulate login
    if (!hasClerk) {
      // Store dev user in localStorage
      localStorage.setItem('dev-user', JSON.stringify(devUser));
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      toast({
        title: "Development Mode",
        description: "Logged in as Development User",
      });
      return;
    }
    
    // This is now handled by Clerk's SignIn component
    window.location.href = '/sign-in';
  };

  const handleSignUp = () => {
    // In dev mode, simulate registration
    if (!hasClerk) {
      // Store dev user in localStorage
      localStorage.setItem('dev-user', JSON.stringify(devUser));
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      toast({
        title: "Development Mode",
        description: "Registered as Development User",
      });
      return;
    }
    
    // This is now handled by Clerk's SignUp component
    window.location.href = '/sign-up';
  };

  const handleLogout = async () => {
    try {
      if (hasClerk && clerkHook) {
        await clerkHook.signOut();
      } else {
        // In development mode, clear localStorage
        localStorage.removeItem('dev-user');
        setIsAuthenticated(false);
      }
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      
      setCurrentView('landing');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  const handleCreateNew = () => {
    setCurrentView('generate');
  };

  const handleNavigation = (view: CurrentView) => {
    setCurrentView(view);
  };

  // Show loading state while Clerk loads
  if (hasClerk && !isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Show landing for non-authenticated users
  if ((hasClerk && !isSignedIn && currentView === 'landing') || (!hasClerk && !isAuthenticated && currentView === 'landing')) {
    return (
      <Landing 
        onGetStarted={handleGetStarted}
        onSignUp={handleSignUp}
      />
    );
  }

  // Handle unauthorized access attempts - redirect to landing if not authenticated
  if ((hasClerk && !isSignedIn) || (!hasClerk && !isAuthenticated)) {
    return (
      <Landing 
        onGetStarted={handleGetStarted}
        onSignUp={handleSignUp}
      />
    );
  }

  // Render the appropriate view for authenticated users
  const renderView = () => {
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
          <Dashboard 
            onCreateNew={handleCreateNew}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
    }
  };

  return renderView();
};

export default Index;
