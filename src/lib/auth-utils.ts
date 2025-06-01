/**
 * Authentication Utilities
 * This file contains helper functions for authentication
 */
import { verifyClerkSetup } from './clerk-utils';

/**
 * Check the authentication setup and display status in console
 * This is useful for debugging auth issues
 */
export function checkAuthSetup() {
  const clerkSetup = verifyClerkSetup();
  
  console.group('🔒 Authentication Setup Status');
  
  console.log('Clerk publishable key:', clerkSetup.isValid ? 'Valid ✅' : 'Invalid ❌');
  
  if (clerkSetup.details.isDevelopment) {
    console.log('Environment: Development (using pk_test_ key)');
  } else if (clerkSetup.details.isProduction) {
    console.log('Environment: Production (using pk_live_ key)');
  } else {
    console.log('Environment: Unknown');
  }
  
  if (!clerkSetup.isValid) {
    console.warn('Issues detected:', clerkSetup.messages);
    console.log('ℹ️ Application will run in development mode with mock authentication');
  }
  
  console.groupEnd();
  
  return clerkSetup;
}

/**
 * Get the current user's display name
 * Works with both Clerk and development mode
 */
export function getUserDisplayName(user: any | null): string {
  if (!user) return 'Guest';
  
  // For Clerk user
  if (user.fullName) return user.fullName;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.username) return user.username;
  if (user.emailAddresses && user.emailAddresses.length > 0) {
    return user.emailAddresses[0].emailAddress.split('@')[0];
  }
  
  // For dev mock user
  if (user.name) return user.name;
  if (user.email) return user.email.split('@')[0];
  
  return 'User';
} 