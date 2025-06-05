import { toast } from '@/components/ui/use-toast';

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

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: 'user_1',
    email: 'teacher@example.com',
    password: 'password123',
    name: 'John Teacher',
    role: 'teacher' as const,
    school: 'Ghana Secondary School',
    subject: 'Mathematics',
    phone: '+233241234567',
    subscription: {
      plan: 'basic' as const,
      expiresAt: '2024-12-31'
    }
  },
  {
    id: 'user_2',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
    school: 'Ministry of Education',
    subject: 'Administration',
    phone: '+233271234567',
    subscription: {
      plan: 'premium' as const,
      expiresAt: '2025-12-31'
    }
  }
];

// In a real app, this would interact with a backend authentication service
export const auth = {
  /**
   * Log in a user with email and password
   */
  login: async (email: string, password: string): Promise<User> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching credentials
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Store user info in localStorage (in a real app, you'd use secure HTTP-only cookies)
      const userData: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        subject: user.subject,
        phone: user.phone,
        subscription: user.subscription
      };
      
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', `mock_token_${Math.random().toString(36).substring(2)}`);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Register a new user
   */
  register: async (
    email: string, 
    password: string, 
    name: string, 
    school: string,
    subject: string,
    phone: string
  ): Promise<User> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user (in a real app, this would be done on the server)
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password,
        name,
        school,
        subject,
        phone,
        role: 'teacher' as const,
        subscription: {
          plan: 'free' as const,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days trial
        }
      };
      
      // Store user info
      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        school: newUser.school,
        subject: newUser.subject,
        phone: newUser.phone,
        subscription: newUser.subscription
      };
      
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', `mock_token_${Math.random().toString(36).substring(2)}`);
      
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  },
  
  /**
   * Check if a user is currently authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
  
  /**
   * Get the current user's information
   */
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem('auth_user');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  /**
   * Get the current authentication token
   */
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  
  /**
   * Request a password reset
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user exists
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      // In a real app, you wouldn't reveal if a user exists for security reasons
      // But we'll still simulate success
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists with this email, you will receive reset instructions.",
      });
      return;
    }
    
    toast({
      title: "Password Reset Email Sent",
      description: "Check your email for instructions to reset your password.",
    });
  }
};

// API request helper with authentication
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = auth.getToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    // Token expired or invalid
    auth.logout();
    window.location.href = '/'; // Redirect to login page
    throw new Error('Session expired. Please log in again.');
  }
  
  return response;
}; 