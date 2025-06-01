/**
 * Clerk Authentication Utilities
 * 
 * This file contains helper functions for working with Clerk authentication.
 */

/**
 * Verifies if Clerk is properly configured in the environment
 * @returns An object with verification details
 */
export const verifyClerkSetup = () => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  const isKeyPresent = !!publishableKey;
  const isKeyEmpty = publishableKey === '';
  
  // According to Clerk docs, these are invalid or placeholder keys
  const isPlaceholder = 
    publishableKey?.includes('your_clerk_publishable_key_here') ||
    publishableKey?.includes('test_your_clerk');
  
  // According to Clerk docs, publishable keys should start with pk_test_ or pk_live_
  const isValidFormat = 
    typeof publishableKey === 'string' && 
    (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'));
  
  const isValid = isKeyPresent && !isKeyEmpty && !isPlaceholder && isValidFormat;
  
  const messages = {
    missing: !isKeyPresent ? 'Clerk publishable key is missing in .env file' : null,
    empty: isKeyEmpty ? 'Clerk publishable key is empty in .env file' : null,
    placeholder: isPlaceholder ? 'You are using a placeholder Clerk publishable key. Replace it with your actual key from Clerk Dashboard.' : null,
    format: (isKeyPresent && !isKeyEmpty && !isPlaceholder && !isValidFormat) ? 
      'Invalid Clerk publishable key format. The key should start with pk_test_ for development or pk_live_ for production.' : null,
  };
  
  const status = isValid ? 'valid' : 'invalid';
  
  return {
    isValid,
    status,
    publishableKey,
    details: {
      isKeyPresent,
      isKeyEmpty,
      isPlaceholder,
      isValidFormat,
      isDevelopment: isValidFormat && publishableKey.startsWith('pk_test_'),
      isProduction: isValidFormat && publishableKey.startsWith('pk_live_'),
    },
    messages: Object.values(messages).filter(Boolean)
  };
};

/**
 * Checks if Clerk is available and properly configured in the application
 * @returns boolean indicating if Clerk is available
 */
export const isClerkAvailable = () => {
  try {
    const hasClerkInWindow = typeof window !== 'undefined' && window.Clerk !== undefined;
    const { isValid } = verifyClerkSetup();
    
    return hasClerkInWindow && isValid;
  } catch (e) {
    console.error('Error checking Clerk availability:', e);
    return false;
  }
}; 