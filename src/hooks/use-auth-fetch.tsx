import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { isClerkAvailable } from '@/lib/clerk-utils';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Mock token for development mode
const mockToken = 'dev-token-12345';

export function useAuthFetch<T>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null
  });
  
  // Only use Clerk auth if available
  const clerkAuth = isClerkAvailable() ? useAuth() : null;
  
  const fetchData = async (url: string, options: RequestInit = {}) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      let token = null;
      
      if (clerkAuth) {
        // Get token from Clerk if available
        token = await clerkAuth.getToken();
      } else {
        // Use mock token in development mode
        token = mockToken;
      }
      
      const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized access
          if (isClerkAvailable()) {
            window.location.href = '/sign-in';
          } else {
            // Clear dev user in localStorage
            localStorage.removeItem('dev-user');
            window.location.href = '/';
          }
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: errorObj });
      throw errorObj;
    }
  };
  
  return { ...state, fetchData };
} 