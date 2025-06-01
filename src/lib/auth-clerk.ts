import { toast } from '@/components/ui/use-toast';
import { isClerkAvailable } from './clerk-utils';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'admin';
  school?: string;
  subject?: string;
  phone?: string;
  subscription?: {
    plan: 'free' | 'basic' | 'premium';
    expiresAt: string;
  };
}

// Development mode mock user
const mockUser: User = {
  id: 'dev-user-1',
  name: 'Development User',
  email: 'dev@example.com',
  role: 'teacher',
  school: 'Dev School',
  subject: 'Computer Science',
  subscription: {
    plan: 'premium',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  }
};

// Mock development token
const mockToken = 'dev-token-12345';

// Auth helper functions
export const auth = {
  // Login function
  login: async () => {
    if (isClerkAvailable()) {
      throw new Error("Use Clerk's signIn component instead");
    }
    
    // In development mode without Clerk, simulate login
    localStorage.setItem('dev-user', JSON.stringify(mockUser));
    return mockUser;
  },
  
  // Register function
  register: async () => {
    if (isClerkAvailable()) {
      throw new Error("Use Clerk's signUp component instead");
    }
    
    // In development mode without Clerk, simulate registration
    localStorage.setItem('dev-user', JSON.stringify(mockUser));
    return mockUser;
  },
  
  // Logout function
  logout: async () => {
    if (isClerkAvailable()) {
      throw new Error("Use Clerk's signOut function instead");
    }
    
    // In development mode without Clerk, clear local storage
    localStorage.removeItem('dev-user');
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (isClerkAvailable()) {
      // This is a placeholder - in components use useUser() from Clerk
      return false;
    }
    
    // In development mode, check if we have a dev user in localStorage
    return localStorage.getItem('dev-user') !== null;
  },
  
  // Get current user data
  getCurrentUser: (): User | null => {
    if (isClerkAvailable()) {
      // This should be replaced with useUser() in components
      return null;
    }
    
    // In development mode, get the dev user from localStorage
    const devUser = localStorage.getItem('dev-user');
    return devUser ? JSON.parse(devUser) : mockUser;
  },
  
  // Get authentication token
  getToken: async (): Promise<string | null> => {
    if (isClerkAvailable()) {
      // This is a placeholder - in API calls use Clerk's getToken()
      return null;
    }
    
    // In development mode, return a mock token
    return mockToken;
  },
  
  // Request password reset
  requestPasswordReset: async () => {
    if (isClerkAvailable()) {
      throw new Error("Use Clerk's forgot password flow instead");
    }
    
    // In development mode, just show a toast
    toast({
      title: "Password Reset",
      description: "In development mode - pretending to send reset email to dev@example.com",
    });
  }
};

// Authenticated fetch function
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };
  
  try {
    let token = null;
    
    if (isClerkAvailable()) {
      // Get token from Clerk if available
      try {
        // This must be used in a component with Clerk's hooks
        // Components should use the useAuthFetch hook instead of this function directly
        if (window.Clerk?.session) {
          token = await window.Clerk.session.getToken();
        }
      } catch (error) {
        console.error('Error getting Clerk token:', error);
      }
    } else {
      // In development mode, use the mock token
      token = mockToken;
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (response.status === 401) {
      // Token expired or invalid
      if (isClerkAvailable()) {
        window.location.href = '/sign-in'; // Redirect to login page
      } else {
        // In development mode, clear localStorage and redirect
        localStorage.removeItem('dev-user');
        window.location.href = '/';
      }
      throw new Error('Session expired. Please log in again.');
    }
    
    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}; 