import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Get the publishable key from environment variables
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we have a valid publishable key (not a placeholder)
const isValidKey = publishableKey && 
  !publishableKey.includes('test_your_clerk') &&
  !publishableKey.startsWith('pk_test_');

// For development - if we don't have a valid key, render without Clerk
if (isValidKey) {
  createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  );
} else {
  console.warn('No valid Clerk publishable key found. Running in development mode without authentication.');
  createRoot(document.getElementById("root")!).render(<App />);
}
