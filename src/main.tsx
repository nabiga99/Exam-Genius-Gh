import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'
import { verifyClerkSetup } from './lib/clerk-utils.ts'
import { checkAuthSetup } from './lib/auth-utils.ts'

// Get the publishable key from environment variables
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check authentication setup and display status
const clerkSetup = checkAuthSetup();

// For development - if we don't have a valid key, render without Clerk
if (clerkSetup.isValid) {
  console.log("Using Clerk authentication with provided publishable key");
  createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  );
} else {
  console.warn('Running in development mode without authentication.');
  createRoot(document.getElementById("root")!).render(<App />);
}
